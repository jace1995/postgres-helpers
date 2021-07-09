import { assertQuery, user, User } from '../mock'

describe('insert', () => {
  it('empty', () => {
    return assertQuery(
      db => db.insert({
        table: user,
        value: {},
      })
    )
  })

  it('value', () => {
    return assertQuery(
      db => db.insert<User>(v => ({
        table: user,
        value: {
          [user.age]: v(30),
          [user.name]: v('noname'),
        },
      })),
      `insert into "user" ("age", "name") values ($1, $2);`,
      [30, 'noname']
    )
  })

  it('values', () => {
    return assertQuery(
      db => db.insert<User>(v => ({
        table: user,
        value: [
          {
            [user.age]: v(30),
            [user.name]: v('test name 1'),
          },
          {
            [user.name]: v('test name 2'),
            [user.age]: v(45),
          },
          {
            [user.age]: v(80),
            [user.name]: v('test name 5'),
            [user.room_id]: v(1),
          },
        ],
      })),
      `insert into "user" ("age", "name", "room_id") values ($1, $2, null), ($4, $3, null), ($5, $6, $7);`,
      [30, 'test name 1', 'test name 2', 45, 80, 'test name 5', 1]
    )
  })

  it('returning *', () => {
    return assertQuery(
      db => db.insert<User>(v => ({
        table: user,
        value: {
          [user.age]: v(30),
          [user.name]: v('noname'),
        },
        returning: true
      })),
      `insert into "user" ("age", "name") values ($1, $2) returning *;`,
      [30, 'noname']
    )
  })

  it('returning id', () => {
    return assertQuery(
      db => db.insert<User>(v => ({
        table: user,
        value: {
          [user.age]: v(30),
          [user.name]: v('noname'),
        },
        returning: [user.id]
      })),
      `insert into "user" ("age", "name") values ($1, $2) returning "id";`,
      [30, 'noname']
    )
  })

  it('returning')
  it('returning select')
})
