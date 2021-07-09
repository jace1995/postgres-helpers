import { Where } from '../types'

export interface WhereProps<V> {
  variant: 'where' | 'having' | 'on'
  condition?: Where<V>
}

export const where = <V>(props: WhereProps<V>): string => {
  const where = props.condition

  if (!where) {
    return ''
  }

  const prefix = ` ${props.variant} `

  if (typeof where === 'string') {
    return prefix + where
  }

  const keys = Object.keys(where)

  if (!keys.length) {
    return ''
  }

  return prefix + (
    keys
      .map(k => `${k} = ${where[k] ? where[k] : 'null'}`)
      .join(' and ')
  )
}
