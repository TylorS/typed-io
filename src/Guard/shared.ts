import { Refinement } from 'hkt-ts/Refinement'
import { DeepEquals } from 'hkt-ts/Typeclass/Eq'

import { GuardHKT } from './Guard'

import * as shared from '@/Constraints/shared'

export interface SharedConstraints<Const = never, Enum extends ReadonlyArray<any> = never>
  extends shared.OmitJsonSchemaOnly<shared.SharedConstraints<GuardHKT, Const, Enum>> {}

export const guardSharedConstraints = <
  A,
  Const = never,
  Enum extends ReadonlyArray<any> = never,
  B extends A = A,
>(
  refinement: Refinement<unknown, A>,
  constraints?: SharedConstraints<Const, Enum>,
  additional?: Refinement<A, B>,
) => {
  type R = shared.GetSharedType<Const, Enum, B>

  return (u: unknown): u is R => {
    if (!constraints) {
      return refinement(u)
    }

    if ('const' in constraints) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return DeepEquals.equals(constraints.const!, u)
    }

    if (constraints.enum) {
      return constraints.enum.some((x) => DeepEquals.equals(x, u))
    }

    const is = refinement(u)

    if (!additional || !is) {
      return is
    }

    return additional(u)
  }
}
