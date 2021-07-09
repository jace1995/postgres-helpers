import { DESC, view } from '../..'
import { COUNT, DISTINCT } from '../../utils/sql'
import { assertQuery, user, User } from '../mock'

describe('select', () => {
  it('*', () => {
    return assertQuery(
      db => db.select<User>({
        table: user
      }),
      `select * from "user";`,
    )
  })

  it('count *', () => {
    return assertQuery(
      db => db.select<User, number>({
        table: user,
        first: COUNT(),
      }),
      `select count(*) as value from "user";`,
    )
  })

  it('columns: id, name', () => {
    return assertQuery(
      db => db.select<User>({
        table: user,
        columns: [user.id, user.name],
      }),
      `select "id", "name" from "user";`,
    )
  })

  it('where: id=1', () => {
    return assertQuery(
      db => db.select<User>(v => ({
        table: user,
        where: {
          [user.id]: v(5),
        }
      })),
      `select * from "user" where "id" = $1;`,
      [5]
    )
  })

  it('where: id = 1 and name = noname', () => {
    return assertQuery(
      db => db.select<User>(v => ({
        table: user,
        where: {
          [user.id]: v(10),
          [user.name]: v('noname'),
        }
      })),
      `select * from "user" where "id" = $1 and "name" = $2;`,
      [10, 'noname']
    )
  })

  it('where (first): age >= 18 or name = moderator', () => {
    const data = {
      name: 'moderator',
      age: 18,
    }
    return assertQuery(
      db => db.select<User>(v => ({
        first: true,
        table: user,
        where: `(${user.age} > ${v(data.age)}) or (${user.name} = ${v(data.name)})`,
      })),
      `select * from "user" where ("age" > $1) or ("name" = $2);`,
      [18, 'moderator']
    )
  })

  it('where: age >= 18 or name = moderator', () => {
    const data = {
      name: 'admin',
      age: 20,
    }
    return assertQuery(
      db => db.select<User>(v => ({
        table: user,
        where: `(${user.age} > ${v(data.age)}) or (${user.name} = ${v(data.name)})`,
      })),
      `select * from "user" where ("age" > $1) or ("name" = $2);`,
      [20, 'admin']
    )
  })

  it('group: name', () => {
    return assertQuery(
      db => db.select<User>({
        table: user,
        group: user.name,
      }),
      `select * from "user" group by "name";`
    )
  })

  it('group by name, min(age)', () => {
    interface Response {
      name: string
      age: number
    }

    return assertQuery(
      db => db.select<User, Response>({
        table: user,
        columns: {
          [user.name]: user.name,
          [user.age]: `min(${user.age})`,
        },
        group: user.name,
      }),
      `select "name", min("age") as "age" from "user" group by "name";`
    )
  })

  it('having without group', () => {
    interface Response {
      name: string
      age: number
    }

    return assertQuery(
      db => db.select<User, Response>(v => ({
        table: user,
        columns: {
          [user.age]: `max(${user.age})`,
          [user.name]: user.name,
        },
        having: `${user.age} > ${v(25)}`,
      })),
      `select max("age") as "age", "name" from "user";`
    )
  })

  it('having with group', () => {
    return assertQuery(
      db => db.select<User>(v => ({
        table: user,
        columns: [user.name],
        group: user.age,
        having: `${user.age} > ${v(25)}`,
      })),
      `select "name" from "user" group by "age" having "age" > $1;`
    )
  })

  it('order by name', () => {
    return assertQuery(
      db => db.select<User>({
        table: user,
        order: user.name,
      }),
      `select * from "user" order by "name";`,
    )
  })
  it('order by name, age desc', () => {
    return assertQuery(
      db => db.select<User>({
        table: user,
        order: [user.name, DESC(user.age)],
      }),
      `select * from "user" order by "name", "age" desc;`,
    )
  })

  it('limit', () => {
    return assertQuery(
      db => db.select<User>({
        table: user,
        limit: 20,
      }),
      `select * from "user" limit 20;`,
    )
  })
  it('no limit', () => {
    return assertQuery(
      db => db.select<User>({
        table: user,
        limit: 2.5,
      }),
      `select * from "user";`,
    )
  })
  it('offset', () => {
    return assertQuery(
      db => db.select<User>({
        table: user,
        offset: 20,
      }),
      `select * from "user" offset 20;`,
    )
  })
  it('no offset', () => {
    return assertQuery(
      db => db.select<User>({
        table: user,
        offset: 2.5,
      }),
      `select * from "user";`,
    )
  })

  it('full select', () => {
    interface Response {
      name: string
      count: number
    }
    const r = view<Response>()
    return assertQuery(
      db => db.select<User, Response>(v => ({
        table: user,
        columns: {
          [r.name]: user.name,
          [r.count]: COUNT(DISTINCT(user.name)),
        },
        where: {
          [user.id]: v(30),
          [user.name]: v('Jon'),
        },
        group: user.age,
        having: `${user.age} > ${v(25)}`,
        order: [r.name, DESC(r.count)],
        limit: 5,
        offset: 10,
      })),
      `select "name", count(distinct "name") as "count" from "user"` +
      ` where "id" = $1 and "name" = $2 group by "age" having "age" > $3` +
      ` order by "name", "count" desc limit 5 offset 10;`,
    )
  })

  it('join-s')
})
