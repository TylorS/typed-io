import { Branded, unsafeCoerce } from 'hkt-ts'

import { Guard } from './Guard'

export const branded =
  <B extends Branded.Branded<any, any>>() =>
  (schema: Guard<Branded.ValueOf<B>>): Guard<B> =>
    unsafeCoerce(schema)
