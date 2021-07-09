import { Pool, defaults } from 'pg'
import { loadConfigOptional } from '@jace1995/load-config'
import { ConnectPostgresDatabase } from './db/connect'
import { PostgresDatabaseInterface } from './types'

export interface PostgresConfig {
  database?: string
  host?: string
  port?: number
  user?: string
  password?: string
  log?: boolean | ((text: string) => void)
}

const toNumber = (value?: string) => (
  (value && !isNaN(Number(value))) ? Number(value) : undefined
)

const toLog = (log?: boolean | ((text: string) => void)) => (
  log ? (log === true ? console.log : log) : undefined
)

export const connectPostgresDB = async (
  config: PostgresConfig = {}
): Promise<PostgresDatabaseInterface> => {
  const env = loadConfigOptional([
    'POSTGRES_DB',
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
  ] as const)

  defaults.parseInt8 = true

  const def: Required<PostgresConfig> = {
    database: config.database ?? env.POSTGRES_DB ?? 'dev',
    host: config.host ?? env.POSTGRES_HOST ?? 'localhost',
    port: config.port ?? toNumber(env.POSTGRES_PORT) ?? 5432,
    user: config.user ?? env.POSTGRES_USER ?? 'postgres',
    password: config.password ?? env.POSTGRES_PASSWORD ?? 'postgres',
    log: config.log ?? false,
  }

  const pool = new Pool({
    database: def.database,
    host: def.host,
    port: def.port,
    user: def.user,
    password: def.password,
  })

  // const client = await pool.connect()

  const db = new ConnectPostgresDatabase(pool, {
    log: toLog(def.log)
  })

  return db
}
