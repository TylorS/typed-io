import { compose } from 'hkt-ts/Refinement'
import { Integer, isInteger, isNumber } from 'hkt-ts/number'

import { Guard, GuardHKT } from './Guard'
import { guardSharedConstraints } from './shared'

import * as NC from '@/Constraints/Integer'
import { GetSharedType, OmitJsonSchemaOnly } from '@/Constraints/shared'

export interface IntegerConstraints<
  Const extends Integer = never,
  Enum extends ReadonlyArray<Integer> = never,
> extends OmitJsonSchemaOnly<NC.IntegerConstraints<GuardHKT, Const, Enum, never>> {}

export const integer = <Const extends Integer = never, Enum extends ReadonlyArray<Integer> = never>(
  constraints?: IntegerConstraints<Const, Enum>,
): Guard<GetSharedType<Const, Enum, Integer>> => ({
  is: guardSharedConstraints(
    compose(isInteger)(isNumber),
    constraints,
    (x): x is GetSharedType<Const, Enum, Integer> => {
      if (!constraints) {
        return true
      }

      const {
        minimum = -Infinity,
        maximum = Infinity,
        exclusiveMinimum,
        exclusiveMaximum,
        multipleOf = 1,
      } = constraints

      const isWithinBounds = x >= minimum && x <= maximum
      const isNotExlusiveInteger = x !== exclusiveMinimum && x !== exclusiveMaximum
      const isMultipleOf = x % multipleOf === 0

      return isWithinBounds && isNotExlusiveInteger && isMultipleOf
    },
  ),
})
