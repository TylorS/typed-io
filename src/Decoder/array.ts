import { constFalse, constTrue, pipe } from 'hkt-ts'
import { makeAssociative } from 'hkt-ts/Array'
import { isNonEmpty, uniq } from 'hkt-ts/NonEmptyArray'
import * as These from 'hkt-ts/These'
import { DeepEquals } from 'hkt-ts/Typeclass/Eq'

import { Decoder, DecoderHKT } from './Decoder'
import { decodeSharedConstraints } from './shared'

import * as CA from '@/Constraints/array'
import { OmitJsonSchemaOnly } from '@/Constraints/shared'
import {
  ConstError,
  EnumError,
  MaxContainsError,
  MinContainsError,
  UniqueItemsError,
  UnknownArrayError,
} from '@/SchemaError/BuiltinErrors'
import { SchemaError, makeSchemaErrorAssociative } from '@/SchemaError/SchemaError'

export interface ArrayConstraints<A>
  extends OmitJsonSchemaOnly<CA.ArrayConstraints<DecoderHKT, A>> {}

export type ArrayErrors<E, O> =
  | E
  | UnknownArrayError
  | ConstError<ReadonlyArray<O>>
  | EnumError<ReadonlyArray<ReadonlyArray<O>>>
  | MinContainsError<ReadonlyArray<unknown>>
  | MaxContainsError<ReadonlyArray<unknown>>
  | UniqueItemsError<ReadonlyArray<unknown>>

export const array = <E, O>(
  member: Decoder<unknown, E, O>,
  constraints?: ArrayConstraints<O>,
): Decoder<unknown, ArrayErrors<E, O>, ReadonlyArray<O>> => {
  const { concat } = These.makeAssociative(
    makeSchemaErrorAssociative<ArrayErrors<E, O>>(''),
    makeAssociative<O>(),
  )

  return decodeSharedConstraints(
    (x: unknown): x is ReadonlyArray<unknown> => Array.isArray(x),
    UnknownArrayError.leaf,
    [],
    constraints,
    (u) => {
      const l = u.length
      const { minContains = 0, maxContains = Infinity, uniqueItems = false } = constraints ?? {}

      const output: These.These<SchemaError<ArrayErrors<E, O>>, ReadonlyArray<O>>[] = u.map((i) =>
        pipe(
          i,
          member.decode,
          These.map((o) => [o]),
        ),
      )
      const hasMinimumItems = l > minContains
      const hasLessThanMaxItems = l < maxContains
      const validUniqueness = isNonEmpty(u) && uniqueItems ? uniq(DeepEquals)(u).length === l : true
      const fatal = [hasMinimumItems, hasLessThanMaxItems, validUniqueness].some((x) => !x)

      if (!hasMinimumItems) {
        output.push(These.Left(MinContainsError.leaf(u, minContains, l)))
      }

      if (!hasLessThanMaxItems) {
        output.push(These.Left(MaxContainsError.leaf(u, maxContains, l)))
      }

      if (!validUniqueness) {
        output.push(These.Left(UniqueItemsError.leaf(u)))
      }

      return pipe(
        output.reduce(concat),
        These.condemnWhen<SchemaError<ArrayErrors<E, O>>>(fatal ? constTrue : constFalse),
      )
    },
  )
}
