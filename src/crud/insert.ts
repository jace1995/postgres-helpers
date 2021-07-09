import { InsertProps } from '../types'
import * as format from '../helpers/returning'

const formatValues = (values: object | object[], keys: string[]): string => (
  Array.isArray(values) ?
    values.map(value => formatValues(value, keys)).join(', ')
  :
    '(' + 
    keys
      .map(key => values[key] ?? 'null')
      .join(', ') +
    ')'
)

const keysValues = (values: object | object[]): string[] => (
  Array.isArray(values) ?
    values.reduce<string[]>((keys, value) => {
      Object.keys(value).forEach(key => {
        if (!keys.includes(key)) {
          keys.push(key)
        }
      })
      return keys
    }, [])
    :
    Object.keys(values)
)

export const insert = <T extends object>(
  props: InsertProps<T, boolean>
): string => {
  if (
    (Array.isArray(props.value) && !props.value.length) ||
    !Object.keys(props.value).length
  ) {
    throw new Error('insert query with empty values')
  }

  return (
    `insert into ${props.table}` +
    ` (${keysValues(props.value).map(key => `${key}`).join(', ')})` +
    ` values ${formatValues(props.value, keysValues(props.value))}` +
    format.returning(props.returning) +
    ';'
  )
}
