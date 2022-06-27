import { isNumber } from 'hkt-ts/number'

import { Guard, GuardHKT } from './Guard'
import { guardSharedConstraints } from './shared'

import * as NC from '@/Constraints/number'
import { GetSharedType, OmitJsonSchemaOnly } from '@/Constraints/shared'

export interface NumberConstraints<
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
> extends OmitJsonSchemaOnly<NC.NumberConstraints<GuardHKT, Const, Enum, never>> {}

export const number = <Const extends number = never, Enum extends ReadonlyArray<number> = never>(
  constraints?: NumberConstraints<Const, Enum>,
): Guard<GetSharedType<Const, Enum, number>> => ({
  is: guardSharedConstraints(
    isNumber,
    constraints,
    (x): x is GetSharedType<Const, Enum, number> => {
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
      const isNotExlusiveNumber = x !== exclusiveMinimum && x !== exclusiveMaximum
      const isMultipleOf = x % multipleOf === 0

      return isWithinBounds && isNotExlusiveNumber && isMultipleOf
    },
  ),
})
