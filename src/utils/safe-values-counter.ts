import { value } from '../helpers/value'

export type SafeValueGenerator = (v: unknown) => string

export interface PostgresValues {
  generator(): SafeValueGenerator
  add(value: unknown): string
  values(): readonly unknown[]
}

abstract class GeneratedValues implements PostgresValues {
  generator() {
    return (v: unknown) => this.add(v)
  }
  abstract add(value: unknown): string
  abstract values(): readonly unknown[]
}

export class SafeValues extends GeneratedValues {
  private _values: unknown[] = []
  
  add(v: unknown) {
    this._values.push(
      typeof v === 'object' && v !== null ?
        JSON.stringify(v) :
        v
    )
    return '$' + this._values.length + (
      typeof v === 'object' && v !== null ?
        '::jsonb' :
        ''
    )
  }

  values(): readonly unknown[] {
    return this._values
  }
}

export class UnsafeValues extends GeneratedValues {
  add(v: unknown) {
    return String(value(v))
  }

  values(): readonly unknown[] {
    return []
  }
}
