import { Pool } from 'pg'
import { PostgresDatabaseSettings } from '../types'
import { BasePostgresDatabase } from './base'

const printCommand = (text: string, values?: unknown[]) => (
  text + '\n' + JSON.stringify(values, null, 2)
)

export class ConnectPostgresDatabase extends BasePostgresDatabase {
  constructor(
    private pg: Pool,
    private settings: PostgresDatabaseSettings = {},
  ) {
    super()
  }

  async query<T>(text: string, values?: unknown[]): Promise<T[]> {
    try {
      const result = await this.pg.query(text, values)

      if (this.settings.log) {
        this.settings.log(printCommand(text, values))
      }

      return result.rows
    }
    catch (e) {
      console.error('SQL Error\n' + printCommand(text, values))
      throw e
    }
  }
}
