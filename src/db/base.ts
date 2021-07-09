import {
  PostgresDatabaseInterface,
  SelectProps,
  InsertProps,
  UpdateProps,
  DeleteProps,
  SetupQuery,
  ValueContainer, Table, ClearProps, FirstRow, SafeProps
} from '../types'

import { select } from '../crud/select'
import { insert } from '../crud/insert'
import { update } from '../crud/update'
import { clear, deletes } from '../crud/delete'

import { CreateSchemeHelpers } from '../setup/scheme'
import { SafeValues } from '../utils/safe-values-counter'

type Result<T> = T[] | T | null

const result = <T>(rows: T[], first?: boolean): Result<T> => (
  first ? (rows[0] ?? null) : rows
)

const isSafeProps = <P>(props: SafeProps<P>): props is P => typeof props !== 'function'

export abstract class BasePostgresDatabase implements PostgresDatabaseInterface {
  abstract query<T>(text: string, values?: readonly unknown[]): Promise<T[]>

  async execQuery<P, R>(
    query: (props: P) => string,
    safeProps: SafeProps<P>,
    isFirst: (props: P) => unknown,
    transform?: (props: P, result: Result<R>) => Result<R>
  ) {
    const safe = new SafeValues()

    const props = isSafeProps<P>(safeProps) ?
      safeProps :
      safeProps(safe.generator())

    const r = result<R>(
      await this.query<R>(
        query(props),
        safe.values()
      ),
      !!isFirst(props),
    )

    if (transform) {
      return transform(props, r)
    }

    return r
  }

  async setup(...queries: SetupQuery[]): Promise<void> {
    const s = new CreateSchemeHelpers()

    const query = queries.map(query => (
      typeof query === 'string' ?
        query :
        query(s)
    )).join('\n')

    await this.query(
      (s.preload.length ? s.preload.join('\n') : '') +
      query + '\n' +
      (s.postload.length ? s.postload.join('\n') : '')
    )
  }

  async select<V extends object, R extends object = V>(
    safeProps: SafeProps<SelectProps<V, R> & Partial<FirstRow>>
  ) {
    return this.execQuery<SelectProps<V, R> & Partial<FirstRow>, R>(
      select,
      safeProps,
      p => !!p.first,
      (props, result) => {
        if (Array.isArray(result)) {
          return result
        }

        if (typeof props.first === 'boolean') {
          return result
        }
        
        return (result as ValueContainer<R>)?.value ?? null
      }
    )
  }

  insert<V extends object>(safeProps: SafeProps<InsertProps<V, boolean>>) {
    return this.execQuery<InsertProps<V, boolean>, V>(
      insert,
      safeProps,
      p => !Array.isArray(p.value),
    )
  }

  update<V extends object>(
    safeProps: SafeProps<UpdateProps<V> & Partial<FirstRow>>
  ) {
    return this.execQuery<UpdateProps<V> & Partial<FirstRow>, V>(
      update,
      safeProps,
      p => p.first,
    )
  }

  delete<V extends object>(
    safeProps: SafeProps<DeleteProps<V> & Partial<FirstRow>>
  ) {
    return this.execQuery<DeleteProps<V> & Partial<FirstRow>, V>(
      deletes,
      safeProps,
      p => p.first,
    )
  }

  async clear(table: Table | Table[], props?: ClearProps) {
    await this.query(
      clear(table, props)
    )
  }
}
