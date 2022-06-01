import { identity } from './identity'

export interface UnknownArray extends ReadonlyArray<unknown> {}

export const unknownArray = identity((u: unknown): u is UnknownArray => Array.isArray(u))
