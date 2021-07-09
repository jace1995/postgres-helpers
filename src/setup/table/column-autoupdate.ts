import { TableColumn } from '../table'
import { FirstRow, Table } from '../../types'
import { CreateSchemeHelpers } from '../scheme'
import { TriggerJoinProps, triggerAutoupdate } from '../trigger/autoupdate'

export interface DefaultAutoupdate<V> {
  default?: V
}

export const columnAutoupdate = <V extends object, R extends object>(
  props: TriggerJoinProps<V, R> & DefaultAutoupdate<V> & Partial<FirstRow>
): TableColumn => (
  table: Table, schemeHelpers: CreateSchemeHelpers
) => (
  key: string
) => {
  schemeHelpers.postload.push(triggerAutoupdate<object, R>(props, table, key))
  return (
    `jsonb not null default '${props.default ? JSON.stringify(props.default) : '[]'}'::jsonb`
  )
}
