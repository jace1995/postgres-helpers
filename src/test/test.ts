import { full } from './../utils/naming';
import {
  column,
  connectPostgresDB,
  createTable,
  pk,
  clearDatabase,
  table,
  select,
  columnAutoupdate,
  join,
} from '..'

import { createEnumType } from '../setup/scheme'
import { pgCast, pgArray, pgType } from '../setup/table/basic-types'
import { dependency } from '../types'
import { ARRAY } from '../utils/sql'
import { user } from './mock'
import { ID, Action, Role, User, Community, CommunityType, CommunityInfo, MemberInfo } from './types'

// utils

// !!! view
export const tables = {
  user: table<User>('user'),
  community: table<Community>('community'),
  union_member: table<UnionMember>('union_member'),
}

export interface UnionMember { // table
  // PK
  user_id: ID<User>
  union_id: ID<Community> // c: on delete cascade, t: Community.type = union

  role: Role // c: default Role.member
}

enum Enums {
  action = 'action',
  role = 'role',
  community_type = 'community_type',
}

const setup = async () => {
  const { user, community, union_member } = tables

  const db = await connectPostgresDB()

  const types = {
    steps: pgArray(pgType.custom(Enums.action))
  }

  await db.setup(
    clearDatabase(),

    createEnumType(Enums.action, Action),
    createEnumType(Enums.role, Role),
    createEnumType(Enums.community_type, CommunityType),

    createTable<User>(user, {
      id: pk(),
      chat: column({
        type: pgType.pk,
        unique: true,
        index: true,
        readonly: true,
      }),
      code: column({
        type: pgType.pk,
        unique: true,
        index: true,
        readonly: true,
      }),
      steps: column({
        type: types.steps,
        default: () => pgCast(ARRAY(), types.steps),
      }),
      action: column({
        type: pgType.custom(Enums.action),
        default: Action.start,
      }),
      payload: column({
        type: pgType.jsonb,
        optional: true,
      }),
      memberships: columnAutoupdate<UnionMember, CommunityInfo>({
        select: {
          table: union_member,
          columns: {
            id: community.id,
            code: community.code,
            name: community.name,
            type: community.type,
            role: union_member.role,
          },
          join: join<Community>({
            table: community,
            on: {
              id: union_member.union_id
            },
          }),
          where: {
            user_id: user.id
          },
        },
        dependencies: [
          dependency<User, Community>({
            table: community,
            keys: [community.name],
            target: row => ({
              id: select<UnionMember>({
                table: union_member,
                columns: [union_member.user_id],
                where: {
                  union_id: row.id
                },
                inside: true,
              })
            }),
          }),
          dependency<User, UnionMember>({
            table: union_member,
            keys: [union_member.role],
            target: row => ({
              id: row.user_id
            }),
          }),
        ],
      }),
    }),

    createTable<Community>(community, {
      id: pk(),
      code: column({
        type: pgType.pk,
        unique: true,
        index: true,
        readonly: true,
      }),
      type: column(pgType.custom(Enums.community_type)),
      name: column(pgType.varchar(255)),
      description: column({
        type: pgType.varchar(255),
        optional: true,
      }),
      image: column({
        type: pgType.varchar(255),
        optional: true,
      }),
      members: columnAutoupdate<UnionMember, MemberInfo>({
        select: {
          table: union_member,
          columns: {
            id: user.id,
            chat: user.chat,
            code: user.code,
            role: union_member.role,
          },
          join: join<User>({
            table: user,
            on: {
              id: union_member.user_id
            },
          }),
          where: {
            user_id: community.id
          },
        },
        dependencies: [
          dependency<Community, UnionMember>({
            table: union_member,
            keys: [union_member.role],
            target: row => ({
              id: row.union_id
            })
          }),
        ],
      }),
    }),

    // TODO: FK
    createTable<UnionMember>(union_member, {
      user_id: column({
        type: pgType.pk,
        pk: true,
      }),
      union_id: column({
        type: pgType.pk,
        pk: true,
      }),
      role: column(pgType.custom(Enums.role)),
    }),
  )

  console.log('Setup done ✅')
}

// setup()
console.log(full(user))
