import { assert, expect } from 'chai'
import { MockPostgresDatabase } from '../db/mock'
import { PostgresDatabaseInterface } from '../types'
import { table } from '../utils/naming'

export interface User {
  id: number
  name: string
  age: number
  room_id: number
}

export const user = table<User>('user')

export interface Room {
  id: number
  name: string
}

export const room = table<Room>('room')

export const assertQuery = async (
  cb: (db: PostgresDatabaseInterface) => any,
  text?: string | undefined,
  values?: unknown[],
) => {
  const db = new MockPostgresDatabase()

  if (text) {
    await cb(db)

    const query = db.queries()[0]
    assert.equal(query?.text, text, 'text')

    if (values) {
      assert.deepEqual(query?.values, values, 'values')
    }
  } else {
    expect(() => cb(db)).throw
  }
}
