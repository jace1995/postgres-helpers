import { CreateSchemeHelpers } from './setup/scheme'
import { Dependency } from './setup/trigger/autoupdate'
import { TableName } from './utils/naming'
import { SafeValueGenerator } from './utils/safe-values-counter'

export type Table<V = unknown> = string | TableName<V>
export type Key = string | String

export type SetupQuery = string | ((s: CreateSchemeHelpers) => string)

// crud

export interface ValueContainer<V> {
  value: V
}

export type Sql = string | String
export type SqlProps<T> = Partial<Record<keyof T, Sql>>
export type Where<V> = string | (V extends object ? Record<string, string> : never)
export type Columns<R extends object> = String[] | Record<string, Sql>
export type Returning = boolean | Key[] | string

export type SafeProps<T> = T | ((v: SafeValueGenerator) => T)

export enum JoinType {
  left = 'left',
  right = 'right',
  inner = 'inner',
  cross = 'cross',
}

export interface Join<T = unknown> {
  type?: JoinType
  table: Table<T>
  on: Where<T>
}

export const join = <V>(props: Join<V>) => props
export const dependency = <T, D>(props: Dependency<T, D>) => props

export interface SelectProps<V extends object, R> {
  table: Table<V>
  columns?: R extends object ? Columns<R> : never
  join?: Join | Join[]
  where?: Where<V>
  group?: Key
  order?: Key | Key[]
  having?: Where<R>
  limit?: number
  offset?: number
  inside?: boolean
}

export interface InsertProps<V extends object, First extends boolean> {
  table: Table<V>
  value: First extends true ? SqlProps<V> : SqlProps<V>[]
  returning?: Returning
}

export interface UpdateProps<V extends object> {
  table: Table<V>
  value: SqlProps<V>
  where?: Where<V>
  returning?: Returning
}

export interface DeleteProps<V extends object> {
  table: Table<V>
  where: Where<V>
  returning?: Returning
}

export interface ClearProps {
  only?: boolean
  cascade?: boolean
}

export interface FirstRow<F = true> {
  first: Sql | (F extends true ? true : never)
}

// connect

export interface PostgresDatabaseSettings {
  log?: ((text: string) => void) | undefined
}

export interface PostgresDatabaseInterface {

  query<V extends object>(text: string, values?: readonly unknown[]): Promise<V[]>

  setup(...queries: SetupQuery[]): Promise<void>

  select<V extends object, R extends number | string | boolean>(
    props: SafeProps<SelectProps<V, R> & FirstRow<false>>
  ): Promise<R>
  select<V extends object, R extends object = V>(
    props: SafeProps<SelectProps<V, R> & FirstRow>
  ): Promise<R>
  select<V extends object, R extends object = V>(
    props: SafeProps<SelectProps<V, R>>
  ): Promise<R[]>
  
  insert<V extends object>(
    props: SafeProps<InsertProps<V, true>>
  ): Promise<V>
  insert<V extends object>(
    props: SafeProps<InsertProps<V, false>>
  ): Promise<V[]>

  update<V extends object>(
    props: SafeProps<UpdateProps<V> & FirstRow>
  ): Promise<V>
  update<V extends object>(
    props: SafeProps<UpdateProps<V>>
  ): Promise<V[]>

  delete<V extends object>(
    props: SafeProps<DeleteProps<V> & FirstRow>
  ): Promise<V>
  delete<V extends object>(
    props: SafeProps<DeleteProps<V>>
  ): Promise<V[]>
  clear(
    table: Table | Table[],
    props?: ClearProps
  ): Promise<void>
}
