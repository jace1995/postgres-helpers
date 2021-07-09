import {
  Columns,
  SelectProps,
  Join,
  FirstRow,
  JoinType,
  ValueContainer,
} from '../types'

import { where } from '../helpers/where'

const singleValueKey: Extract<keyof ValueContainer<unknown>, 'value'> = 'value'

const formatColumns = <R>(
  cols?: (R extends object ? Columns<R> : never) | FirstRow['first'],
): string => {
  if (!cols || cols === true) {
    return ' *'
  }

  if (Array.isArray(cols)) {
    return ' ' + cols.join(', ')
  }

  if (cols instanceof String || typeof cols === 'string') {
    return ` ${cols} as ${singleValueKey}`
  }

  return ' ' + Object.keys(cols)
    .map(k => `${k}` === String(cols[k]) ? `${k}` : `${cols[k]} as ${k}`)
    .join(', ')
}

const formatJoin = (join?: Join | Join[]): string => {
  if (!join) {
    return ''
  }

  const joins = Array.isArray(join) ? join : [join]

  return joins.map(j => (
    ` ${j.type ?? JoinType.left} join ${j.table}` +
    where({
      variant: 'on',
      condition: j.on,
    })
  )).join(' ')
}

const formatGroup = (key?: string | String): string => (
  key ? ' group by ' + key : ''
)

const formatOrder = (key?: string | string[] | String | String[]): string => {
  if (!key) {
    return ''
  }

  const keys = Array.isArray(key) ? key : [key]
  
  return ' order by ' + keys.join(', ')
}

const formatLimit = (limit?: number): string => (
  Number.isInteger(limit) ? (' limit ' + limit) : ''
)
const formatOffset = (offset?: number) => (
  Number.isInteger(offset) ? (' offset ' + offset) : ''
)

export const select = <V extends object, R = V> (
  props: SelectProps<V, R> & Partial<FirstRow>
): string => {
  return (
    (props.inside ? '(' : '') +
    'select' +
    formatColumns<R>(
      props.columns ?
        props.columns :
        props.first
    ) +
    ' from ' + props.table +
    formatJoin(props.join) +

    where<V>({
      variant: 'where',
      condition: props.where,
    }) +

    formatGroup(props.group) +
    (
      props.group ?
      where<R>({
        variant: 'having',
        condition: props.having,
      }) :
      ''
    ) +

    formatOrder(props.order) +
    formatLimit(props.limit) + // ?? props.first ? 1 : 
    formatOffset(props.offset) +
    (props.inside ? ')' : ';')
  )
}
