import { Returning } from '../types'

export const returning = (returning?: Returning): string => {
  if (!returning) {
    return ''
  }

  return (
    ' returning ' + (
      returning === true ?
        '*' : (
        typeof returning === 'string' ?
          returning :
          returning.join(', ')
        )
    )
  )
}
