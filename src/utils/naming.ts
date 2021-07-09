import { Table } from "../types"

export type TableName<T> = Readonly<Record<keyof T, string>>

export const table = <T extends object = {}>(
  tableName: string
): TableName<T> => (
  new Proxy(new String(tableName) as any, {
    get(target, key) {
      if (key === Symbol.toPrimitive) {
        return () => `"${tableName}"`
      }
      if (typeof key === 'symbol') {
        return target[key]
      }
      return `"${key}"`
    },
  })
)

export const full = <T extends Table>(
  table: T
): T => (
  new Proxy(new String(table) as any, {
    get(target, key) {
      if (key === Symbol.toPrimitive) {
        return () => `${table}`
      }
      if (typeof key === 'symbol') {
        return target[key]
      }
      return `${table}."${key}"`
    },
  })
)

export const view = <T extends object>(): Readonly<Record<keyof T, string>> => (
  new Proxy({} as any, {
    get(target, key) {
      if (typeof key === 'symbol') {
        return target[key]
      }
      return `"${key}"`
    }
  })
)

export const jsonKeys = <T extends object>(): Readonly<Record<keyof T, string>> => (
  new Proxy({} as any, {
    get(target, key) {
      if (typeof key === 'symbol') {
        return target[key]
      }
      return `${key}`
    }
  })
)
