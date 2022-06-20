import { Integer } from 'hkt-ts/number'

import { JsonSchema, JsonSchemaHKT } from './JsonSchema'

import * as IC from '@/Constraints/integer'
import { GetSharedType } from '@/Constraints/shared'

export interface IntegerConstraints<
  Const extends Integer = never,
  Enum extends ReadonlyArray<Integer> = never,
  Default extends Integer = never,
> extends IC.IntegerConstraints<JsonSchemaHKT, Const, Enum, Default> {}

export const integer = <
  Const extends Integer = never,
  Enum extends ReadonlyArray<Integer> = never,
  Default extends Integer = never,
>(
  constraints?: IntegerConstraints<Const, Enum, Default>,
): JsonSchema<GetSharedType<Const, Enum, Integer | Default>> =>
  JsonSchema({
    type: 'integer',
    ...constraints,
  })
