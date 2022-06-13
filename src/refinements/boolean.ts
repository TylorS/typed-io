import * as B from 'hkt-ts/boolean'

import { GetSharedType, SharedConstraints } from '@/JsonSchema/JsonSchema'

export const isBoolean =
  <Const extends boolean = never, Enum extends ReadonlyArray<boolean> = never>(
    constraints?: SharedConstraints<Const, Enum>,
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
