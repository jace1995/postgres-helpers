export const value = (v: unknown) => {
  if (v === undefined || v === null) {
    return 'null'
  }
  if (typeof v === 'number' && !isNaN(v) && isFinite(v)) {
    return v
  }
  if (typeof v === 'string') {
    return `'${v}'`
  }
  if (typeof v === 'boolean') {
    return v ? 'true' : 'false'
  }
  if (typeof v === 'function') {
    return String(v())
  }
  if (typeof v === 'object') {
    return `'${String(JSON.stringify(v)).replace(`'`, `''`)}'::jsonb`
  }
  throw new Error(`SQL Error: unknown value type (${v})`)
}
