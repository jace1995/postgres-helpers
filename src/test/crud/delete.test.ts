import { assertQuery, user, User } from '../mock'

describe('delete', () => {
  it('all', () => {
    return assertQuery(
      db => db.delete({
        table: user,
        where: {},
      }),
      `delete from "user";`
    )
  })
  it('where object', () => {
    return assertQuery(
      db => db.delete(v => ({
        table: user,
        where: {
          [user.id]: v(10),
          [user.name]: v('admin'),
        },
      })),
      `delete from "user" where "id" = $1 and "name" = $2;`,
      [10, 'admin']
    )
  })
  it('where data', () => {
    const data = {
      age: 20
    }
    return assertQuery(
      db => db.delete<User>(v => ({
        table: user,
        where: `${user.age} > ${v(data.age)}`,
      })),
      `delete from "user" where "age" > $1;`,
      [20]
    )
  })
  
  it('first')
  it('returning')
  it('returning select')
})
