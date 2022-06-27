import { HKT } from 'hkt-ts/HKT'
import * as B from 'hkt-ts/boolean'

import { GetSharedType, SharedConstraints } from '@/Constraints/shared'

export const isBoolean =
  <Const extends boolean = never, Enum extends ReadonlyArray<boolean> = never>(
    constraints?: SharedConstraints<HKT, Const, Enum>,
  ) =>
  (x: unknown): x is GetSharedType<Const, Enum, boolean> => {
    if (!B.isBoolean(x)) {
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

    return true
  }
