import { select } from '../../crud/select'
import { update } from '../../crud/update'
import { concatName } from '../../setup/scheme'
import { FirstRow, Key, SelectProps, Table, Where } from '../../types'
import { createTrigger, TriggerAction, TriggerStep } from './trigger'

export type Condition<T = unknown, D = unknown> = string | (
  (row: Record<keyof D, string>) => Where<T>
)

export interface Dependency<T, D> {
  table: Table<D>
  keys?: Key[]
  target: Condition<T, D>
}

export interface TriggerJoinProps<V extends object, R extends object> extends Partial<FirstRow> {
  triggerName?: string
  select: string | (SelectProps<V, R>)
  dependencies: Dependency<any, any>[]
}

const acceptCondition = (condition: Condition<any>, rowType: 'new' | 'old'): Where<any> => {
  if (typeof condition === 'function') {
    return condition(new Proxy({}, {
      get({ }, key) {
        return `${rowType}."${String(key)}"`
      }
    }))
  }
  
  return condition
}

const selectInsideQuery = (props: SelectProps<any, any>) => {
  props.inside = true
  return select(props)
}

const resetDefaultFirst = (key: Key) => (
`
if jsonb_typeof(new.${key}) = 'array' then
  new.${key} = new.${key}->0;
end if;
`
)

const resetDefaultArray = (key: Key) => (
`
if new.${key} is null then
  new.${key} = '[]'::jsonb;
end if;
`
)

export const triggerAutoupdate = <V extends object, R extends object>(
  props: TriggerJoinProps<V, R>,
  table: Table<V>,
  key: string
) => {
  const insideSelect = typeof props.select === 'string' ? props.select : selectInsideQuery(props.select)
  const querySelect = `(select jsonb_agg(row) from ${insideSelect} row)`

  const trigger = (dependency: Dependency<any, any>, action: TriggerAction) => (
    createTrigger({
      name: props.triggerName ?? concatName([
        'a',
        table,
        key,
        action[0],
        dependency.table
      ]),
      table: dependency.table,
      step: TriggerStep.after,
      action,
      keys: dependency.keys,
      query: update<object>({
        table,
        value: {
          [key]: querySelect
        },
        where: acceptCondition(
          dependency.target,
          action === TriggerAction.delete ? 'old' : 'new',
        ),
      }),
    })
  )

  const dependenciesMap = props.dependencies.reduce(
    (map, dependency) => {
      const table = String(dependency.table)
      if (!(table in map)) {
        map[table] = []
      }
      map[table].push(dependency)
      return map
    },
    {} as Record<string, Dependency<any, any>[]>
  )

  return (
    Object.values(dependenciesMap).map(dependencies => (
      trigger(dependencies[0], TriggerAction.insert) + '\n' +
      trigger(dependencies[0], TriggerAction.delete) + '\n' +
      dependencies.map(dependency => (
        trigger(dependency, TriggerAction.update)
      )).join('\n')
    )).join('\n') +

    createTrigger({
      name: concatName(['d', table, key]),
      table,
      keys: [key],
      step: TriggerStep.before,
      action: TriggerAction.update,
      query: props.first ? resetDefaultFirst(key) : resetDefaultArray(key)
    })
  )
}
