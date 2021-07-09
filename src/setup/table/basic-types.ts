// !
export enum PostgresTypeBase {
  // TODO: learn
  box, // rectangular box on a plane
  bytea, // binary data("byte array")
  cidr, // IPv4 or IPv6 network address
  circle, // circle on a plane
  inet, // IPv4 or IPv6 host address
  interval, // [fields][(p)] time span
  line, // infinite line on a plane
  lseg, // line segment on a plane
  macaddr, // MAC(Media Access Control) address
  money, // currency amount
  decimal, // [(p, s)] exact numeric of selectable precision
  path, // geometric path on a plane
  pg_lsn, // PostgreSQL Log Sequence Number
  point, // geometric point on a plane
  polygon, // closed geometric path on a plane
  tsquery, // text search query
  tsvector, // text search document
  txid_snapshot, // user - level transaction ID snapshot
  uuid, // universally unique identifier
  xml, // XML data
  
  // TODO: add
  date, // calendar date(year, month, day)
  time, // [(p)] time of day(no time zone)
  timetz, // time of day, including time zone
  timestamp, // [(p)] date and time(no time zone)
  timestamptz, // [(p)] date and time, including time zone
}

export const pgType = {
  pk: 'int8',
  int: (n: 2 | 4 | 8 = 8) => `int${n}`,
  float: (n: 4 | 8 = 8) => `float${n}`,
  boolean: 'boolean',

  char: (n: number) => `char(${n})`,
  varchar: (n: number) => `varchar(${n})`,
  text: 'text',

  bit: (n: number) => `bit(${n})`,
  varbit: (n: number) => `varbit(${n})`,
  jsonb: 'jsonb',

  custom: (type: string) => `"${type}"`
}

// !
// const typeGenerator = (result: (type: string) => string): typeof pgType => new Proxy(pgType, {
//   get(target, key) {
//     const value = target[key]
//     if (typeof value === 'function') {
//       return (...props: any[]) => result(value(...props))
//     }
//     return result(value)
//   }
// })

export const pgArray = (type: string, dimension: number = 1) => (
  type + new Array(dimension).fill('[]').join('')
)

export const pgCast = (value: string, type: string) => value + '::' + type
