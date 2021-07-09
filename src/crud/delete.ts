import { ClearProps, DeleteProps, Table } from '../types'
import { where } from '../helpers/where'
import { returning } from '../helpers/returning'

export const deletes = <T extends object>(
  props: DeleteProps<T>
): string => (
  `delete from ${props.table}` +
  where({
    variant: 'where',
    condition: props.where,
  }) +
  // TODO: add limit for first
    returning(props.returning) +
    ';'
)

export const clear = (
  table: Table | Table[],
  props: ClearProps = {}
): string => (
  'truncate' + 
  ( props.only ? ' only' : '' ) + ' ' + 
  ( Array.isArray(table) ? table.join(', ') : table ) + 
  ( props.cascade ? ' cascade' : '' ) +
  ';'
)
