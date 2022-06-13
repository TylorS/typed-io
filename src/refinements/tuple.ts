import { makeEq } from 'hkt-ts/Array'
import { DeepEquals } from 'hkt-ts/Typeclass/Eq'

import type { Guard } from '@/Guard/Guard'
import { TupleConstraints } from '@/JsonSchema/JsonSchema'

const anyArrayEq = makeEq(DeepEquals)

export const isTuple = <A extends ReadonlyArray<any>>(
  refinements: { readonly [K in keyof A]: Guard<A[K]> },
  constraints?: TupleConstraints<A>,
) => {
  return (u: unknown): u is A => {
    if (!Array.isArray(u)) {
      return false
    }

    if (!constraints) {
      return true
    }

    if (constraints.const) {
      return anyArrayEq.equals(u, constraints.const)
    }

    if (constraints.enum) {
      return constraints.enum.some((e) => anyArrayEq.equals(e, u))
    }

    return u.every((x, i) => refinements[i].is(x))
  }
}
