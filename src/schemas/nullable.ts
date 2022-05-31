import { literal } from './literal'
import { union } from './union'

import { AnySchema } from '@/Schema'

const null_ = literal(null)

export { null_ as null }

export const nullable = <S extends AnySchema>(schema: S) => union(null_, schema)
