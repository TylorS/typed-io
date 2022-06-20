import { Maybe } from 'hkt-ts/Maybe'

import { JsonSchema, JsonSchemaHKT } from './JsonSchema'
import { string } from './string'
import { struct } from './struct'
import { sum } from './sum'

import { SharedConstraints } from '@/Constraints/shared'
import { prop } from '@/Schema'

export const maybe = <A>(
  value: JsonSchema<A>,
  constraints?: SharedConstraints<JsonSchemaHKT, Maybe<A>>,
): JsonSchema<Maybe<A>> =>
  sum<Maybe<A>>(constraints)('tag')({
    Nothing: struct({
      tag: prop(string({ const: 'Nothing' })),
    }),
    Just: struct({
      tag: prop(string({ const: 'Just' })),
      value: prop(value),
    }),
  })
