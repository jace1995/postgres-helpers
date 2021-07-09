import { value } from '../../helpers/value'
import { CreateTableHelpers } from '../table'
import {
  constraintUnique,
  constraintForeignKey,
  ColFK,
} from './constraint'

import { Key, Table } from '../../types'
import { createTrigger, TriggerAction, TriggerStep, TriggerColumn } from '../trigger/trigger'
import { concatName, createIndex, CreateSchemeHelpers } from '../scheme'
import { triggerReadonly } from '../trigger/readonly'

export interface FK {
  tableJoin: ColFK['tableJoin']
  key: Key
  onDelete?: ColFK['onDelete']
  onUpdate?: ColFK['onUpdate']
}

export interface ColProps<T = object> {
  type: string
  optional?: boolean
  default?: unknown

  pk?: boolean
  index?: boolean
  unique?: boolean
  readonly?: boolean
  fk?: FK

  beforeUpdate?: TriggerColumn<T>
  afterUpdate?: TriggerColumn<T>
}

export const column = <T = object>(props: string | ColProps<T>) => (
  table: Table, schemeHelpers: CreateSchemeHelpers
) => (
  key: string, tableHelpers: CreateTableHelpers
) => {
  if (typeof props === 'string') {
    return `${props} not null`
  }

  if (props.pk) {
    tableHelpers.pk.push(key)
  }

  if (props.index) {
    tableHelpers.postload.push(createIndex([key])(table))
  }

  if (props.unique) {
    tableHelpers.constraints.push(constraintUnique([key]))
  }

  if (
    props.readonly ||
    props.pk && props.readonly !== false
  ) {
    tableHelpers.postload.push(triggerReadonly(table, key))
  }

  if (props.fk) {
    tableHelpers.constraints.push(constraintForeignKey({
      ...props.fk,
      columns: {
        [key]: props.fk.key
      },
    }))
  }

  if (props.beforeUpdate) {
    schemeHelpers.postload.push(
      createTrigger<T>({
        name: concatName([table, TriggerStep.before, TriggerAction.update, key]),
        table,
        keys: [key],
        step: TriggerStep.before,
        action: TriggerAction.update,
        query: props.beforeUpdate,
      })
    )
  }

  if (props.afterUpdate) {
    schemeHelpers.postload.push(
      createTrigger<T>({
        name: concatName([table, TriggerStep.after, TriggerAction.update, key]),
        table,
        keys: [key],
        step: TriggerStep.after,
        action: TriggerAction.update,
        query: props.afterUpdate,
      })
    )
  }

  return (
    props.type +
    (props.optional ? '' : ' not null') +
    (
      typeof props.default !== 'undefined' ? 
      ` default ${value(props.default)}` : 
      (props.optional ? ' default null' : '')
    )
  )
}
