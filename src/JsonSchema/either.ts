import { Either } from 'hkt-ts/Either'

import { JsonSchema, JsonSchemaHKT } from './JsonSchema'
import { string } from './string'
import { struct } from './struct'
import { sum } from './sum'

import { SharedConstraints } from '@/Constraints/shared'
import { prop } from '@/Schema'

export const either = <E, A>(
  left: JsonSchema<E>,
  right: JsonSchema<A>,
  constraints?: SharedConstraints<JsonSchemaHKT, Either<E, A>>,
): JsonSchema<Either<E, A>> =>
  sum<Either<E, A>>(constraints)('tag')({
    Left: struct({
      tag: prop(string({ const: 'Left' })),
      left: prop(left),
    }),
    Right: struct({
      tag: prop(string({ const: 'Right' })),
      right: prop(right),
    }),
  })
