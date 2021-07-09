import { pgType, pgArray, pgCast } from './setup/table/basic-types';
import { connectPostgresDB } from './connection'
import { PostgresDatabaseInterface, Join, join } from './types'

import { clearDatabase, createEnumType, createSequence, createIndex } from './setup/scheme'

import { createTable } from './setup/table'
import { columnAutoupdate } from './setup/table/column-autoupdate'
import { column, ColProps } from './setup/table/column'
import { pk } from './setup/table/pk'

import {
  constraintUnique,
  constraintCheck,
  constraintForeignKey,
  constraintPrimaryKey,

  ColFK,
  FkAction,
} from './setup/table/constraint'

import { table, view, full, jsonKeys } from './utils/naming'


import { select } from './crud/select'
import { insert } from './crud/insert'
import { update } from './crud/update'
import { deletes, clear } from './crud/delete'

import { ARRAY, COUNT, DESC, IN, DISTINCT } from './utils/sql'

export {
  connectPostgresDB, PostgresDatabaseInterface,
  clearDatabase, createEnumType, createIndex, createSequence,

  createTable,
  columnAutoupdate,
  column, ColProps, pk,

  constraintUnique,
  constraintCheck,
  constraintForeignKey,
  constraintPrimaryKey,
  ColFK,
  FkAction, Join, join,

  table, view, full, jsonKeys,
  select, insert, update, deletes, clear,
  ARRAY, COUNT, DESC, IN, DISTINCT,
  pgType, pgArray, pgCast,
}
