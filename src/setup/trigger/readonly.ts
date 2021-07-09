import { Table } from '../../types'
import { concatName } from '../scheme'
import { createTrigger, TriggerAction, TriggerStep } from './trigger'

export const triggerReadonly = (table: Table, key: string) => (
  createTrigger({
    name: concatName(['r', table, key]),
    table,
    step: TriggerStep.before,
    action: TriggerAction.update,
    keys: [key],
    query: (old, upd) => `${upd[key]} := ${old[key]};`,
  })
)
