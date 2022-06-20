import { JsonSchema, JsonSchemaHKT } from './JsonSchema'

import * as NC from '@/Constraints/number'
import { GetSharedType } from '@/Constraints/shared'

export interface NumberConstraints<
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
  Default extends number = never,
> extends NC.NumberConstraints<JsonSchemaHKT, Const, Enum, Default> {}

export const number = <
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
  Default extends number = never,
>(
  constraints?: NumberConstraints<Const, Enum, Default>,
): JsonSchema<GetSharedType<Const, Enum, number | Default>> =>
  JsonSchema({
    type: 'number',
    ...constraints,
  })
