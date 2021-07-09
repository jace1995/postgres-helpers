import { CreateTableHelpers } from '../table'
import { createSequence, sequenceName } from '../scheme'

import { Table } from '../../types'
import { triggerReadonly } from '../trigger/readonly'
import { pgType } from './basic-types'

export const pk = () => (table: Table) => (
  key: string,
  helpers: CreateTableHelpers,
) => {
  helpers.preload.push(createSequence(String(table)))
  helpers.postload.push(triggerReadonly(table, key))
  helpers.pk.push(`"${key}"`)
  return `${pgType.pk} not null default nextval('${sequenceName(String(table)).replace(/"/g, '')}')`
}
