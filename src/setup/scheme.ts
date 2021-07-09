import { $enum } from 'ts-enum-util'
import { Key, Table } from '../types'

export class CreateSchemeHelpers {
  preload: string[] = []
  postload: string[] = []
}

export const clearDatabase = () => (
  'drop schema if exists public cascade;\n' +
  'create schema public;'
)

export const nativeKey = (key: unknown) => String(key).replace(/"/g, '').replace(/\./g, '__')
export const concatName = (keys: unknown[]) => `"${keys.map(nativeKey).join('__')}"`

export const indexName = (attr: unknown[]) => concatName(['i', ...attr])
export const createIndex = (keys: Key[]) => (table: Table) => (
  `create index ${indexName([table, ...keys])} on ${table} (${keys.join(', ')});`
)

export const sequenceName = (name: string) => concatName(['s', name])
export const createSequence = (name: string) => (
  `create sequence ${sequenceName(name)};`
)

export type Enum = Record<string, string>
export const createEnumType = <E extends string>(name: E, values: Enum) => (
  `create type "${name}" as enum (${$enum(values).getValues().map(v => `'${v}'`).join(', ')});`
)

export const constraintName = (type: string, attr: unknown[]) => concatName(['c', type, ...attr])
export const functionName = (attr: unknown[]) => concatName(['f', ...attr])
export const triggerName = (attr: unknown[]) => concatName(['t', ...attr])
