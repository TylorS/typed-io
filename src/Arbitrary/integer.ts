import { Integer } from 'hkt-ts/number'

import { Arbitrary, ArbitraryHKT } from './Arbitrary'
import { sharedArbitrary } from './shared'

import * as IC from '@/Constraints/integer'
import { GetSharedType, OmitJsonSchemaOnly } from '@/Constraints/shared'
import { isInteger } from '@/refinements/integer'

export interface IntegerConstraints<
  Const extends Integer = never,
  Enum extends ReadonlyArray<Integer> = never,
> extends OmitJsonSchemaOnly<IC.IntegerConstraints<ArbitraryHKT, Const, Enum, never>> {}

export const integer = <Const extends Integer = never, Enum extends ReadonlyArray<Integer> = never>(
  constraints?: IntegerConstraints<Const, Enum>,
): Arbitrary<GetSharedType<Const, Enum, Integer>> =>
  sharedArbitrary(
    (fc) => fc.integer(toFastCheckIntegerConstraints(constraints)),
    constraints,
    isInteger<Const, Enum>(constraints),
    'integer',
  ) as Arbitrary<GetSharedType<Const, Enum, Integer>>

export function toFastCheckIntegerConstraints<
  Const extends Integer = never,
  Enum extends ReadonlyArray<Integer> = never,
>(constraints?: IntegerConstraints<Const, Enum>): import('fast-check').IntegerConstraints {
  if (!constraints) {
    return {}
  }

  return {
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
