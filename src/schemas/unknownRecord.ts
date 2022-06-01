import { identity } from './identity'

export interface UnknownRecord extends Readonly<Record<PropertyKey, unknown>> {}

export const unknownRecord = identity(
  (u: unknown): u is UnknownRecord => !!u && !Array.isArray(u) && typeof u === 'object',
)
