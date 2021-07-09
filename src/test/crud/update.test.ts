import { assertQuery, user, User } from '../mock'

describe('update', () => {
  it('empty', () => {
    return assertQuery(
      db => db.update({
        table: user,
        value: {},
      }),
    )
  })
  it('value', () => {
    return assertQuery(
      db => db.update<User>(v => ({
        table: user,
        value: {
          [user.name]: v('noname')
        },
      })),
      `update "user" set "name" = $1;`,
      ['noname']
    )
  })

  it('where object', () => {
    return assertQuery(
      db => db.update<User>(v => ({
        table: user,
        value: {
          [user.name]: v('noname')
        },
        where: {
          [user.id]: v(25)
        },
      })),
      `update "user" set "name" = $1 where "id" = $2;`,
      ['noname', 25]
    )
  })
  it('where data', () => {
    const data = {
      minAge: 15,
      maxAge: 35,
    }
    return assertQuery(
      db => db.update<User>(v => ({
        table: user,
        value: {
          [user.name]: v('moderator')
        },
        where: `${user.age} > ${v(data.minAge)} and ${user.age} < ${v(data.maxAge)}`,
        data,
      })),
      `update "user" set "name" = $1 where "age" > $2 and "age" < $3;`,
      ['moderator', 15, 35]
    )
  })

  it('returning *', () => {
    return assertQuery(
      db => db.update<User>(v => ({
        table: user,
        value: {
          [user.name]: v('admin'),
        },
        where: {
          [user.id]: v(45)
        },
        first: true,
        returning: true
      })),
      `update "user" set "name" = $1 where "id" = $2 returning *;`,
      ['admin', 45]
    )
  })
  it('returning id', () => {
    return assertQuery(
      db => db.update<User>(v => ({
        table: user,
        value: {
          [user.name]: v('user'),
        },
        where: {
          [user.id]: v(15)
        },
        returning: [user.id]
      })),
      `update "user" set "name" = $1 where "id" = $2 returning "id";`,
      ['user', 15]
    )
  })

  it('first')
  it('returning')
  it('returning select')
})
