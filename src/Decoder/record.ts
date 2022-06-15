import { constTrue, pipe } from 'hkt-ts'
import * as A from 'hkt-ts/Array'
import { Left, Right } from 'hkt-ts/Either'
import { ReadonlyRecord } from 'hkt-ts/Record'
import * as These from 'hkt-ts/These'
import { makeAssignIdentity } from 'hkt-ts/struct'

import * as D from './Decoder'
import { flatMapThese } from './flatMap'
import { decodeSharedConstraints } from './shared'

import * as RC from '@/Constraints/record'
import { OmitJsonSchemaOnly } from '@/Constraints/shared'
import {
  ConstError,
  EnumError,
  MaxPropertiesError,
  MinPropertiesError,
  PatternPropertiesError,
  ToRoseTree,
  UnknownRecordError,
} from '@/SchemaError/BuiltinErrors'
import {
  MissingKeys,
  OptionalKey,
  RequiredKey,
  SchemaError,
  makeSchemaErrorAssociative,
} from '@/SchemaError/SchemaError'
import { isUnknownRecord } from '@/refinements/record'

export interface RecordConstraints<K extends string, A>
  extends OmitJsonSchemaOnly<RC.RecordConstraints<D.DecoderHKT, K, A>> {}

export const record = <E extends ToRoseTree, A, K extends string = string>(
  codomain: D.Decoder<unknown, E, A>,
  constraints?: RecordConstraints<K, A>,
): D.Decoder<
  unknown,
  | E
  | UnknownRecordError
  | ConstError<ReadonlyRecord<K, A>>
  | EnumError<ReadonlyArray<ReadonlyRecord<K, A>>>
  | MinPropertiesError<ReadonlyRecord<string, unknown>>
  | MaxPropertiesError<ReadonlyRecord<string, unknown>>
  | PatternPropertiesError<unknown, E>,
  ReadonlyRecord<K, A>
> => {
  const ID = These.makeIdentity(
    makeSchemaErrorAssociative<any>(''),
    makeAssignIdentity<ReadonlyRecord<K, A>>(),
  )
  const foldLeft = A.foldLeft(ID)
  const memoized = new WeakMap<Readonly<Record<PropertyKey, unknown>>, Array<[string, unknown]>>()

  const getEntries = (x: Readonly<Record<PropertyKey, unknown>>) => {
    if (memoized.has(x)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return memoized.get(x)!
    }

    const entries = Object.entries(x)

    memoized.set(x, entries)

    return entries
  }

  const additionalRefinments = constraints
    ? ([
        [
          (x: Readonly<Record<PropertyKey, unknown>>): x is ReadonlyRecord<K, A> => {
            const { minProperties = 0 } = constraints
            const entries = getEntries(x)

            return entries.length >= minProperties
          },
          (actual: Readonly<Record<PropertyKey, unknown>>) =>
            MinPropertiesError.leaf(
              actual,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              constraints.minProperties!,
              getEntries(actual).length,
            ),
        ] as const,

        [
          (x: Readonly<Record<PropertyKey, unknown>>): x is ReadonlyRecord<K, A> => {
            const { maxProperties = Infinity } = constraints
            const entries = getEntries(x)

            return entries.length <= maxProperties
          },
          (actual: Readonly<Record<PropertyKey, unknown>>) =>
            MaxPropertiesError.leaf(
              actual,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              constraints.maxProperties!,
              getEntries(actual).length,
            ),
        ] as const,
      ] as const)
    : []

  const decoder = decodeSharedConstraints(
    isUnknownRecord,
    UnknownRecordError.leaf,
    additionalRefinments,
    constraints,
  )

  return pipe(
    decoder,
    flatMapThese((u) => {
      if (u === constraints?.default) {
        return These.Right(u as ReadonlyRecord<K, A>)
      }

      const entries = getEntries(u)

      if (entries.length === 0) {
        return These.Right(u as ReadonlyRecord<K, A>)
      }

      if (!constraints) {
        return foldLeft(
          entries.map(([k, a]) =>
            pipe(
              a,
              codomain.decode,
              These.bimap(
                (e) => new OptionalKey(k, e),
                (a) => ({ [k]: a } as ReadonlyRecord<K, A>),
              ),
            ),
          ),
        )
      }

      const { patternProperties, required = [] } = constraints
      const [missingKeys, existingKeys] = pipe(
        required,
        A.partitionMap((k) => (k in u ? Right(k) : Left(k))),
      )

      const output: These.These<
        SchemaError<
          | E
          | MinPropertiesError<ReadonlyRecord<string, unknown>>
          | MaxPropertiesError<ReadonlyRecord<string, unknown>>
          | PatternPropertiesError<unknown, E>
        >,
        ReadonlyRecord<K, A>
      >[] = existingKeys.map((k) =>
        pipe(
          codomain.decode(u[k]),
          These.bimap(
            (s) => new RequiredKey(k, s),
            (a) => ({ [k]: a } as ReadonlyRecord<K, A>),
          ),
        ),
      )

      let fatal = false

      if (A.isNonEmpty(missingKeys)) {
        output.push(These.Left(new MissingKeys(missingKeys)))
        fatal = true
      }

      if (patternProperties) {
        output.push(
          ...Object.entries(patternProperties).flatMap(([source, decoder]) => {
            const regex = new RegExp(source, 'u')

            return entries.flatMap(([key, value]) => {
              if (!regex.test(key)) {
                return []
              }

              const result = decoder.decode(value) as These.These<SchemaError<E>, A>

              if (These.isLeft(result)) {
                fatal = true
              }

              return [
                pipe(
                  result,
                  These.bimap(
                    (s) => PatternPropertiesError.leaf(value, source, s),
                    (a) => ({ [key]: a } as ReadonlyRecord<K, A>),
                  ),
                ),
              ] as const
            })
          }),
        )
      }

      const result = foldLeft(output)

      // If our result contains fatal errors, convert a Both back into a Left.
      return fatal ? pipe(result, These.condemnWhen<SchemaError<E>>(constTrue)) : result
    }),
  )
}
