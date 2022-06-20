import { JsonSchema, JsonSchemaHKT } from './JsonSchema'

import { GetSharedType, SharedConstraints } from '@/Constraints/shared'

export interface BooleanConstraints<
  Const extends boolean = never,
  Enum extends ReadonlyArray<boolean> = never,
  Default extends boolean = never,
> extends SharedConstraints<JsonSchemaHKT, Const, Enum, Default> {}

export const boolean = <
  Const extends boolean = never,
  Enum extends ReadonlyArray<boolean> = never,
  Default extends boolean = never,
>(
  constraints?: BooleanConstraints<Const, Enum, Default>,
): JsonSchema<GetSharedType<Const, Enum, boolean | Default>> =>
  JsonSchema({
    type: 'boolean',
    ...constraints,
  })
