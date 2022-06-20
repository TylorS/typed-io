import { Data } from 'hkt-ts/Data'

import { JsonSchema, JsonSchemaHKT } from './JsonSchema'
import { maybe } from './maybe'
import { progress } from './progress'
import { string } from './string'
import { struct } from './struct'
import { sum } from './sum'

import { SharedConstraints } from '@/Constraints/shared'
import { prop } from '@/Schema'

export const data = <A>(
  value: JsonSchema<A>,
  constraints?: SharedConstraints<JsonSchemaHKT, Data<A>>,
): JsonSchema<Data<A>> =>
  sum<Data<A>>(constraints)('tag')({
    NoData: struct({
      tag: prop(string({ const: 'NoData' })),
    }),
    Pending: struct({
      tag: prop(string({ const: 'Pending' })),
      progress: prop(maybe(progress())),
    }),
    Refreshing: struct({
      tag: prop(string({ const: 'Refreshing' })),
      value: prop(value),
      progress: prop(maybe(progress())),
    }),
    Replete: struct({
      tag: prop(string({ const: 'Replete' })),
      value: prop(value),
    }),
  })
