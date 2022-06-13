import { isNonEmpty, makeEq } from 'hkt-ts/Array'
import { uniq } from 'hkt-ts/NonEmptyArray'
import { Refinement } from 'hkt-ts/Refinement'
import { DeepEquals } from 'hkt-ts/Typeclass/Eq'

import { ArrayConstraints } from '@/JsonSchema/JsonSchema'

const anyArrayEq = makeEq(DeepEquals)
const toUnique = uniq(anyArrayEq)

export const isArray = <A>(
  refinement: Refinement<unknown, A>,
  constraints?: ArrayConstraints<A>,
) => {
  return (u: unknown): u is ReadonlyArray<A> => {
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

    const { minContains = 0, maxContains = Infinity, uniqueItems } = constraints

    const length = u.length
    const withinRange = length >= minContains && length <= maxContains

    if (!withinRange) {
      return false
    }

    if (uniqueItems && isNonEmpty(u)) {
      return toUnique(u).length === length
    }

    return u.every(refinement)
  }
}
