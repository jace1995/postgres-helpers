import { UpdateProps } from '../types'
import { where } from '../helpers/where'
import { returning } from '../helpers/returning'

const formatSet = <T>(values: T): string => (
  ' ' + Object.keys(values).map(k => `${k} = ${values[k]}`).join(', ')
)

export const update = <T extends object>(
  props: UpdateProps<T>
): string => {
  if (!Object.keys(props.value).length) {
    throw new Error('update query with value')
  }

  return (
    `update ${props.table} set` +
    formatSet(props.value) +
    where({
      variant: 'where',
      condition: props.where,
    }) +
    // TODO: add limit for first
    returning(props.returning) +
    ';'
  )
}
