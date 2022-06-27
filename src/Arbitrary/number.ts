import { Arbitrary, ArbitraryHKT } from './Arbitrary'
import { sharedArbitrary } from './shared'

import * as NC from '@/Constraints/number'
import { GetSharedType, OmitJsonSchemaOnly } from '@/Constraints/shared'
import { isNumber } from '@/refinements/number'

export interface NumberConstraints<
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
> extends OmitJsonSchemaOnly<NC.NumberConstraints<ArbitraryHKT, Const, Enum, never>> {}

export const number = <Const extends number = never, Enum extends ReadonlyArray<number> = never>(
  constraints?: NumberConstraints<Const, Enum>,
): Arbitrary<GetSharedType<Const, Enum, number>> =>
  sharedArbitrary(
    (fc) =>
      fc.oneof(
        fc.float(toFastCheckNumberConstraints(constraints)),
        fc.integer(toFastCheckNumberConstraints(constraints)),
      ),
    constraints,
    isNumber<Const, Enum>(constraints),
    'number',
  )

export function toFastCheckNumberConstraints<
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
>(
  constraints?: NumberConstraints<Const, Enum>,
): import('fast-check').IntegerConstraints & import('fast-check').FloatConstraints {
  if (!constraints) {
    return {}
  }

  return {
    noNaN: true,
    noDefaultInfinity: true,
    min:
      constraints.minimum !== undefined && constraints.minimum === constraints.exclusiveMinimum
        ? constraints.minimum + 1
        : constraints.minimum,
    max:
      constraints.maximum !== undefined && constraints.maximum === constraints.exclusiveMaximum
        ? constraints.maximum - 1
        : constraints.maximum,
  }
}
