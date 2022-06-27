import { Guard } from './Guard'
import { or } from './union'

export const isNull = (x: unknown): x is null => x === null

const null_ = Guard(isNull)

export { null_ as null }

export const nullable = or(null_)
