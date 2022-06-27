import { Arbitrary, ArbitraryHKT } from './Arbitrary'
import { sharedArbitrary } from './shared'

import { OmitJsonSchemaOnly } from '@/Constraints/shared'
import * as SC from '@/Constraints/string'
import { isString } from '@/refinements/string'

export interface StringConstraints<
  Const extends string = never,
  Enum extends ReadonlyArray<string> = never,
  Format extends SC.StringFormat = never,
> extends OmitJsonSchemaOnly<SC.StringConstraints<ArbitraryHKT, Const, Enum, Format>> {}

export const string = <
  Const extends string = never,
  Enum extends ReadonlyArray<string> = never,
  Format extends SC.StringFormat = never,
>(
  constraints?: StringConstraints<Const, Enum, Format>,
): Arbitrary<SC.GetTypeFromStringConstraints<Const, Enum, Format>> =>
  sharedArbitrary(
    (fc) => fc.string(toFastCheckStringConstraints(constraints)),
    constraints,
    isString<Const, Enum, Format>(constraints),
    'string',
  ) as Arbitrary<SC.GetTypeFromStringConstraints<Const, Enum, Format>>

export function toFastCheckStringConstraints<
  Const extends string = never,
  Enum extends ReadonlyArray<string> = never,
  Format extends SC.StringFormat = never,
>(
  constraints?: StringConstraints<Const, Enum, Format>,
): import('fast-check').StringSharedConstraints {
  if (!constraints) {
    return {}
  }

  return {
    minLength: constraints.minLength,
    maxLength: constraints.maxLength,
  }
}
