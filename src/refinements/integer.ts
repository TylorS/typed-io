import { HKT } from 'hkt-ts/HKT'
import * as N from 'hkt-ts/number'

import { IntegerConstraints } from '@/Constraints/integer'
import { GetSharedType, OmitJsonSchemaOnly } from '@/Constraints/shared'

export const isInteger =
  <Const extends N.Integer = never, Enum extends ReadonlyArray<N.Integer> = never>(
    constraints?: OmitJsonSchemaOnly<IntegerConstraints<HKT, Const, Enum>>,
  ) =>
  (x: unknown): x is GetSharedType<Const, Enum, N.Integer> => {
    if (!N.isNumber(x) || !N.isInteger(x)) {
      return false
    }

    if (!constraints) {
      return true
    }

    if ('const' in constraints) {
      return constraints.const === x
    }

    if (constraints.enum) {
      return constraints.enum.includes(x)
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
  }
