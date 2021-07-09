import { Key, Table } from '../../types'
import { constraintName } from '../scheme'

export const constraintCheck = (condition: string) => (table: Table) => (
  `constraint ${constraintName('check', [table])} check (${condition})`
)

export const constraintUnique = (keys: Key[]) => (table: Table) => (
  `constraint ${constraintName('unique', [table, ...keys])} unique (${keys.join(', ')})`
)

export const constraintPrimaryKey = (keys: Key[]) => (table: Table) => (
  `constraint ${constraintName('pk', [table, ...keys])} primary key (${keys.join(', ')})`
)

export enum FkAction {
  restrict,
  cascade,
  set_null,
  no_action,
}

const fkAction: Record<FkAction, string> = {
  [FkAction.restrict]: 'restrict',
  [FkAction.cascade]: 'cascade',
  [FkAction.set_null]: 'set null',
  [FkAction.no_action]: 'no action',
}

export interface ColFK {
  tableJoin: Table
  columns: Record<string, Key>
  onDelete?: FkAction
  onUpdate?: FkAction
}

export const constraintForeignKey = (props: ColFK) => (table: Table) => (
  `constraint ${constraintName('fk', [
    table,
    props.tableJoin,
    ...Object.entries(props.columns).reduce((array, keys) => [...array, ...keys], [] as Key[])
  ])} foreign key (${
    Object.keys(props.columns).join(', ')
  }) references ${props.tableJoin} (${
    Object.values(props.columns).join(', ')
  })${
    props.onDelete ? ' on delete ' + fkAction[props.onDelete] : ''
  }${
    props.onUpdate ? ' on update ' + fkAction[props.onUpdate] : ''
  }`
)
