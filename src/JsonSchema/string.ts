import { JsonSchema, JsonSchemaHKT } from './JsonSchema'

import * as SC from '@/Constraints/string'

export interface StringConstraints<
  Const extends string = never,
  Enum extends ReadonlyArray<string> = never,
  Format extends SC.StringFormat = never,
> extends SC.StringConstraints<JsonSchemaHKT, Const, Enum, Format> {}

export const string = <
  Const extends string = never,
  Enum extends ReadonlyArray<string> = never,
  Format extends SC.StringFormat = never,
>(
  constraints?: StringConstraints<Const, Enum, Format>,
): JsonSchema<SC.GetTypeFromStringConstraints<Const, Enum, Format>> =>
  JsonSchema({
    type: 'string',
    ...constraints,
    pattern: constraints?.pattern ? constraints.pattern.source : undefined,
  })
