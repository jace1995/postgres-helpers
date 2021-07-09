// import { Table } from '../types'

// const drop = (object: string, name: string, on?: Table): string => (
//   `drop ${object} if exists ${name}${on ? ` on ${on}` : ''};`
// )

// export const dropTable = (name: Table) => drop('table', String(name))
// export const dropType = (name: string) => drop('type', name)
// export const dropSequence = (name: string) => drop('sequence', name)
// export const dropIndex = (name: string) => drop('index', name)

// export const dropTrigger = (name: string, table: Table) => drop('index', name, table)

// export const updateEnumTypes = <E extends string>(enums: Record<E, Enum>) => (
//   Object.entries<Enum>(enums).map(([name, Enum]) => (
//     dropType(name) + '\n' +
//     createEnumType(name, Enum)
//   )).join('\n')
// )
