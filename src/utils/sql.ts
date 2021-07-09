import { Key } from '../types'

export const COUNT = (keys?: Key | Key[]) => (
  'count(' +
  (
    !keys ? 
      '*' :
      (
        Array.isArray(keys) ?
          keys.join(',') :
          keys
      )
    ) +
  ')'
)
export const DISTINCT = (key: Key) => `distinct ${key}`
export const DESC = (key: Key) => key + ' desc'

// !!! test
export const ARRAY = (value: string[] = []) => `array[${value.join(',')}]`
export const IN = (array: string[]) => `in (${array.join(',')})`

// !
// + array functions
// + jsonb functions
