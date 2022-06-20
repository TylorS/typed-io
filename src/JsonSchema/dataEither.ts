import { DataEither } from 'hkt-ts/DataEither'

import { JsonSchema, JsonSchemaHKT } from './JsonSchema'
import { data } from './data'
import { either } from './either'

import { SharedConstraints } from '@/Constraints/shared'

export const dataEither = <E, A>(
  E: JsonSchema<E>,
  A: JsonSchema<A>,
  constraints?: SharedConstraints<JsonSchemaHKT, DataEither<E, A>>,
): JsonSchema<DataEither<E, A>> => data(either(E, A), constraints)
