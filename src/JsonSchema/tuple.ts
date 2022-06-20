import { JsonSchema, JsonSchemaHKT } from './JsonSchema'

import * as TC from '@/Constraints/tuple'

export interface TupleConstraints<A extends ReadonlyArray<any>>
  extends TC.TupleConstraints<JsonSchemaHKT, A> {}

export const tuple = <A extends ReadonlyArray<any>>(
  items: { readonly [K in keyof A]: JsonSchema<A[K]> },
  constraints?: TupleConstraints<A>,
) =>
  JsonSchema<A>({
    type: 'array',
    items,
    minItems: items.length,
    ...constraints,
  })
