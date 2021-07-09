import { Key, Table } from '../../types'
import { functionName, triggerName } from '../scheme'

export type TriggerRow<T> = Record<keyof T, string> 
export type TriggerColumn<T = object> = string | (
  (oldRow: TriggerRow<T>, newRow: TriggerRow<T>) => string
)

export enum TriggerStep {
  before = 'before',
  after = 'after',
}

export enum TriggerAction {
  insert = 'insert',
  update = 'update',
  delete = 'delete',
  // ! truncate = 'truncate',
}

export interface TriggerProps<T = object> {
  name: string
  table: Table
  step: TriggerStep
  action: TriggerAction | TriggerAction[]
  keys?: Key[]
  query: TriggerColumn<T>
}

const mockRow = (mode: 'new' | 'old'): TriggerRow<any> => new Proxy({}, {
  get({}, key) {
    return `${mode}."${String(key)}"`
  }
})

const actionCommand = (action: TriggerAction, keys?: Key[]) => (
  action + (
    action === TriggerAction.update && keys?.length ?
      ' of ' + keys.join(', ') :
      ''
  )
)

export const createTrigger = <T = object>(props: TriggerProps<T>) => {
  const f_name = functionName([props.name])
  const t_name = triggerName([props.name])

  const query = typeof props.query === 'string' ?
    props.query :
    props.query(mockRow('old'), mockRow('new'))

  const actions = Array.isArray(props.action) ?
    props.action.map(action => actionCommand(action, props.keys)).join(' or ') :
    actionCommand(props.action, props.keys)

  return (
`
create function ${f_name}()
returns trigger as $$
begin
  ${query}
  if (tg_op = 'INSERT' or tg_op = 'UPDATE') then
    return new;
  elsif (tg_op = 'DELETE') then
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger ${t_name}
${props.step} ${actions} on ${props.table}
for each row execute procedure ${f_name}();
`
  )
}
