import { Table } from '../types'
import { concatName, CreateSchemeHelpers } from './scheme'
import { constraintPrimaryKey } from './table/constraint'
import { createTrigger, TriggerAction, TriggerRow, TriggerStep } from './trigger/trigger'

export type TableConstraints = ((table: Table) => string)[]

export class CreateTableHelpers {
  pk: string[] = []
  preload: string[] = []
  postload: string[] = []
  constraints: TableConstraints = []
}

export type TableColumn<V = unknown> = string | (
  (table: Table<V>, schemeHelpers: CreateSchemeHelpers) => 
  (key: string, tableHelpers: CreateTableHelpers) => 
  string
)

export const dropTable = (name: Table) => `drop table if exists ${name};`

export type TableTrigger<V> = (row: TriggerRow<V>) => string

export interface CreateTableOptions<V> {
  constraints?: TableConstraints
  beforeInsert?: TableTrigger<V>
  afterInsert?: TableTrigger<V>
  beforeDelete?: TableTrigger<V>
  afterDelete?: TableTrigger<V>
}

export const createTable = <V>(
  table: Table<V>,
  values: Record<keyof V, TableColumn<V>>,
  options?: CreateTableOptions<V> | TableConstraints
) => (schemeHelpers: CreateSchemeHelpers) => {
  const helpers = new CreateTableHelpers()

  const tableOptions: CreateTableOptions<V> = (
    Array.isArray(options) ?
      {
        constraints: options
      } :
      (options ?? {})
  )
  
  if (tableOptions.constraints) {
    helpers.constraints.push(...tableOptions.constraints)
  }

  const attachTrigger = (
    trigger: TableTrigger<V>,
    step: TriggerStep,
    action: TriggerAction.insert | TriggerAction.delete
  ) => {
    helpers.postload.push(
      createTrigger<V>({
        name: concatName([table, step, action]),
        table,
        step,
        action,
        query: (() => {
          switch (action) {
            case TriggerAction.insert:
              return (_: unknown, newRow: TriggerRow<V>) => trigger(newRow)
              case TriggerAction.delete:
              return (oldRow: TriggerRow<V>) => trigger(oldRow)
          }
        })()
      })
    )
  }

  if (tableOptions.beforeInsert) {
    attachTrigger(tableOptions.beforeInsert, TriggerStep.before, TriggerAction.insert)
  }

  if (tableOptions.afterInsert) {
    attachTrigger(tableOptions.afterInsert, TriggerStep.after, TriggerAction.insert)
  }

  if (tableOptions.beforeDelete) {
    attachTrigger(tableOptions.beforeDelete, TriggerStep.before, TriggerAction.delete)
  }

  if (tableOptions.afterDelete) {
    attachTrigger(tableOptions.afterDelete, TriggerStep.after, TriggerAction.delete)
  }
  
  const query = (
    `create table ${table} (` +
    Object.entries<TableColumn<V>>(values).map(
      ([key, value]) => `"${key}" ${
        typeof value === 'function' ? 
        value(table, schemeHelpers)(key, helpers) : 
        value
      }`
    ).join(', ') +
    ((helpers.pk.length) ? ', ' + constraintPrimaryKey(helpers.pk)(table) : '') +
    ((helpers.constraints.length) ? ', ' + helpers.constraints.map(c => c(table)).join(', ') : '') +
    `);`
  )
  return (
    ((helpers.preload.length) ? helpers.preload.join('\n') : '') + '\n' +
    query +
    ((helpers.postload.length) ? '\n' + helpers.postload.join('\n') : '')
  )
}
