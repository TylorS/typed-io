import * as N from 'hkt-ts/number'

import { GetSharedType, NumberConstraints } from '@/JsonSchema/JsonSchema'

export const isNumber =
  <Const extends number = never, Enum extends ReadonlyArray<number> = never>(
    constraints?: NumberConstraints<Const, Enum>,
  ) =>
  (x: unknown): x is GetSharedType<Const, Enum, number> => {
    if (!N.isNumber(x)) {
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
