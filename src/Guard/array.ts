import { isNonEmpty, uniq } from 'hkt-ts/NonEmptyArray'
import { DeepEquals } from 'hkt-ts/Typeclass/Eq'

import { Guard, GuardHKT } from './Guard'
import { guardSharedConstraints } from './shared'

import * as CA from '@/Constraints/array'
import { OmitJsonSchemaOnly } from '@/Constraints/shared'

export interface ArrayConstraints<A> extends OmitJsonSchemaOnly<CA.ArrayConstraints<GuardHKT, A>> {}

const toUnique = uniq(DeepEquals)

export const isUnknownArray = (u: unknown): u is ReadonlyArray<unknown> => Array.isArray(u)

export const unknownArray = Guard(isUnknownArray)

export const array = <A>(
  guard: Guard<A>,
  constraints?: ArrayConstraints<A>,
): Guard<ReadonlyArray<A>> => ({
  is: guardSharedConstraints(isUnknownArray, constraints, (u): u is ReadonlyArray<A> => {
    const { minContains = 0, maxContains = Infinity, uniqueItems } = constraints ?? {}

    const length = u.length
    const withinRange = length >= minContains && length <= maxContains

    if (!withinRange) {
      return false
    }

    if (uniqueItems && isNonEmpty(u)) {
      return toUnique(u).length === length
    }

    return u.every(guard.is)
  }),
})
