import { Branded, unsafeCoerce } from 'hkt-ts'

import { JsonSchema } from './JsonSchema'

export const branded =
  <B extends Branded.Branded<any, any>>() =>
  (schema: JsonSchema<Branded.ValueOf<B>>): JsonSchema<B> =>
    unsafeCoerce(schema)
