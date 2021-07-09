import { BasePostgresDatabase } from './base'

export interface Query {
  text: string
  values?: readonly unknown[]
}

export class MockPostgresDatabase extends BasePostgresDatabase {
  private _responses: any[][]
  private _queries: Query[]
  private _n: number
  private _force: boolean

  constructor(responses?: unknown[][], force?: boolean) {
    super()
    this._responses = responses ?? []
    this._queries = []
    this._n = 0
    this._force = force ?? false
  }

  async query(text: string, values?: readonly unknown[]) {
    this._queries.push({ text, values })

    if (this._force && this._n >= this._queries.length) {
      throw new Error('MockPostgresDatabase: response not found')
    }

    return this._responses[this._n++] ?? []
  }

  queries(): readonly Query[] {
    return this._queries
  }
}
