import { Constrain, Params, Variance, constTrue, pipe } from 'hkt-ts'
import * as A from 'hkt-ts/Array'
import { Left, Right } from 'hkt-ts/Either'
import { ReadonlyRecord } from 'hkt-ts/Record'
import * as These from 'hkt-ts/These'
import { makeAssignIdentity } from 'hkt-ts/struct'

import * as D from './Decoder'
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

export interface RecordConstraints<E, K extends string, A>
  extends OmitJsonSchemaOnly<
    RC.RecordConstraints<Constrain<D.DecoderHKT, Params.E, Variance.Invariant<E>>, K, A>
  > {}

export type RecordErrors<
  E extends ToRoseTree,
  A,
  E2 extends ToRoseTree,
  K extends string = string,
> =
  | E
  | UnknownRecordError
  | ConstError<ReadonlyRecord<K, A>>
  | EnumError<ReadonlyArray<ReadonlyRecord<K, A>>>
  | MinPropertiesError<ReadonlyRecord<string, unknown>>
  | MaxPropertiesError<ReadonlyRecord<string, unknown>>
  | PatternPropertiesError<unknown, E2>

export const record = <
  E extends ToRoseTree,
  A,
  E2 extends ToRoseTree = never,
  K extends string = string,
>(
  codomain: D.Decoder<unknown, E, A>,
  constraints?: RecordConstraints<E2, K, A>,
): D.Decoder<unknown, RecordErrors<E, A, E2, K>, ReadonlyRecord<K, A>> => {
  const ID = These.makeIdentity(
    makeSchemaErrorAssociative<any>(''),
    makeAssignIdentity<ReadonlyRecord<K, A>>(),
  )
  const foldLeft = A.foldLeft(ID)

  return decodeSharedConstraints(isUnknownRecord, UnknownRecordError.leaf, [], constraints, (u) => {
    const entries = Object.entries(u)

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

    const {
      minProperties = 0,
      maxProperties = Infinity,
      patternProperties,
      required = [],
    } = constraints
    const [missingKeys, existingKeys] = pipe(
      required,
      A.partitionMap((k) => (k in u ? Right(k) : Left(k))),
    )

    const output: These.These<SchemaError<RecordErrors<E, A, E2, K>>, ReadonlyRecord<K, A>>[] =
      existingKeys.map(
        (
          k, // Use codomain decoder on required fields
        ) =>
          pipe(
            codomain.decode(u[k]),
            These.bimap(
              (s) => new RequiredKey(k, s),
              (a) => ({ [k]: a } as ReadonlyRecord<K, A>),
            ),
          ),
      )

    // Validate MinProperties
    if (entries.length < minProperties) {
      output.push(These.Left(MinPropertiesError.leaf(u, minProperties, entries.length)))
    }

    // Validate MaxProperties
    if (entries.length > maxProperties) {
      output.push(These.Left(MaxPropertiesError.leaf(u, maxProperties, entries.length)))
    }

    // Track missing required keys
    if (A.isNonEmpty(missingKeys)) {
      output.push(These.Left(new MissingKeys(missingKeys)))
    }

    // Check pattern properties
    if (patternProperties) {
      output.push(
        ...Object.entries(patternProperties).flatMap(([source, decoder]) => {
          const regex = new RegExp(source, 'u')

          return entries.flatMap(
            ([key, value]): ReadonlyArray<
              These.These<SchemaError<RecordErrors<E, A, E2, K>>, ReadonlyRecord<K, A>>
            > => {
              if (!regex.test(key)) {
                return []
              }

              return [
                pipe(
                  decoder.decode(value),
                  These.bimap(
                    (s) => PatternPropertiesError.leaf(value, source, s),
                    (a) => ({ [key]: a } as ReadonlyRecord<K, A>),
                  ),
                ),
              ] as const
            },
          )
        }),
      )
    }

    // If our result contains fatal errors, convert a Both back into a Left.
    return pipe(output, foldLeft, These.condemnWhen<SchemaError<E>>(constTrue))
  })
}
