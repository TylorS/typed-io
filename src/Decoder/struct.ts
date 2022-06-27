import { pipe } from 'hkt-ts'
import * as A from 'hkt-ts/Array'
import { Left, Right } from 'hkt-ts/Either'
import { NonEmptyArray } from 'hkt-ts/NonEmptyArray'
import { ReadonlyRecord } from 'hkt-ts/Record'
import * as These from 'hkt-ts/These'
import { Eq } from 'hkt-ts/string'
import { makeAssignAssociative } from 'hkt-ts/struct'

import { Decoder, DecoderHKT, ErrorOf } from './Decoder'
import { isUnknownRecord } from './isUnknownRecord'
import { decodeSharedConstraints } from './shared'

import * as SC from '@/Constraints/struct'
import { Property } from '@/Schema'
import {
  DependencyError,
  PatternPropertiesError,
  ToRoseTree,
  UnknownRecordError,
} from '@/SchemaError/BuiltinErrors'
import {
  MissingKeys,
  OptionalKey,
  RequiredKey,
  SchemaError,
  UnexpectedKeys,
  makeSchemaErrorAssociative,
} from '@/SchemaError/SchemaError'

type UnknownDecoder<A = any> = Decoder<unknown, any, A> | Decoder<unknown, never, A>
type ValuesOf<T> = T[keyof T]

const diffStrings = A.difference(Eq)

export type StructErrors<
  Props extends ReadonlyRecord<string, Property<UnknownDecoder, boolean>>,
  Additional extends UnknownDecoder = never,
  PatternProperties extends ReadonlyRecord<string, UnknownDecoder<string>> = never,
  Dependencies extends ReadonlyRecord<
    keyof Props & string,
    | UnknownDecoder<ValuesOf<SC.BuildStruct<DecoderHKT, Props>>>
    | NonEmptyArray<keyof Props & string>
  > = never,
  Built = [Additional] extends [never]
    ? SC.BuildStruct<DecoderHKT, Props>
    : SC.BuildStruct<DecoderHKT, Props> & SC.StructAdditionalProperties<Additional>,
> =
  | UnknownRecordError
  | {
      [K in keyof Props]: Props[K] extends Property<infer Decoder, boolean>
        ? ErrorOf<Decoder>
        : never
    }[keyof Props]
  | {
      [K in keyof PatternProperties]: ErrorOf<PatternProperties[K]> extends ToRoseTree
        ? PatternPropertiesError<Built, ErrorOf<PatternProperties[K]>>
        : PatternPropertiesError<Built, never>
    }[keyof PatternProperties]
  | {
      [K in keyof Dependencies]: ErrorOf<Dependencies[K]> extends ToRoseTree
        ? DependencyError<Built, ErrorOf<Dependencies[K]>>
        : DependencyError<Built, never>
    }[keyof Dependencies]

export interface StructConstraints<
  Props extends ReadonlyRecord<string, Property<UnknownDecoder, boolean>>,
  Additional extends UnknownDecoder = never,
  PatternProperties extends ReadonlyRecord<string, UnknownDecoder<string>> = never,
  Dependencies extends ReadonlyRecord<
    keyof Props & string,
    | UnknownDecoder<ValuesOf<SC.BuildStruct<DecoderHKT, Props>>>
    | NonEmptyArray<keyof Props & string>
  > = never,
> extends SC.StructConstraints<DecoderHKT, Props, Additional, PatternProperties, Dependencies> {}

export const struct = <
  Props extends ReadonlyRecord<string, Property<UnknownDecoder, boolean>>,
  Additional extends UnknownDecoder = never,
  PatternProperties extends ReadonlyRecord<string, UnknownDecoder<string>> = never,
  Dependencies extends ReadonlyRecord<
    keyof Props & string,
    | UnknownDecoder<ValuesOf<SC.BuildStruct<DecoderHKT, Props>>>
    | NonEmptyArray<keyof Props & string>
  > = never,
>(
  properties: Props,
  constraints?: StructConstraints<Props, Additional, PatternProperties, Dependencies>,
): Decoder<
  unknown,
  StructErrors<Props, Additional, PatternProperties, Dependencies> extends infer R ? R : never,
  [Additional] extends [never]
    ? SC.BuildStruct<DecoderHKT, Props>
    : SC.BuildStruct<DecoderHKT, Props> & SC.StructAdditionalProperties<Additional>
> => {
  const propKeys = Object.keys(properties)
  const { concat } = These.makeAssociative(
    makeSchemaErrorAssociative<any>(''),
    makeAssignAssociative<any>(),
  )

  return decodeSharedConstraints(isUnknownRecord, UnknownRecordError.leaf, [], constraints, (u) => {
    const keys = Object.keys(u)
    const [missingKeys, unexpectedKeys] = pipe(
      keys,
      diffStrings(propKeys),
      A.partitionMap((k) => (k in properties ? Left(k) : Right(k))),
    )

    const entries = Object.entries(u)
    const output: These.These<SchemaError<any>, ReadonlyRecord<string, any>>[] = entries.flatMap(
      ([k, v]) => {
        if (!(k in properties)) {
          return []
        }

        const { value, isOptional } = properties[k]

        return [
          pipe(
            v,
            value.decode,
            These.bimap(
              (e) => (isOptional ? new OptionalKey(k, e) : new RequiredKey(k, e)),
              (a) => ({ [k]: a }),
            ),
          ),
        ]
      },
    )

    if (A.isNonEmpty(missingKeys)) {
      output.push(Left(new MissingKeys(missingKeys)))
    }

    if (A.isNonEmpty(unexpectedKeys)) {
      output.push(Left(new UnexpectedKeys(unexpectedKeys)))
    }

    const { patternProperties, dependencies } = constraints ?? {}

    // Check pattern properties
    if (patternProperties) {
      output.push(
        ...Object.entries(patternProperties).flatMap(([source, decoder]) => {
          const regex = new RegExp(source, 'u')

          return entries.flatMap(
            ([key, value]): ReadonlyArray<These.These<SchemaError<any>, any>> => {
              if (!regex.test(key)) {
                return []
              }

              return [
                pipe(
                  decoder.decode(value),
                  These.bimap(
                    (s) => PatternPropertiesError.leaf(value, source, s),
                    (a) => ({ [key]: a }),
                  ),
                ),
              ] as const
            },
          )
        }),
      )
    }

    if (dependencies) {
      output.push(
        ...Object.entries(dependencies).flatMap(
          ([k, deps]): ReadonlyArray<
            These.These<SchemaError<any>, ReadonlyRecord<string, any>>
          > => {
            if (Array.isArray(deps)) {
              const missingKeys = deps.filter((d) => !(d in u))

              return [These.Left(DependencyError.leaf(u, k, new MissingKeys(missingKeys)))]
            }

            return [
              pipe(
                (deps as UnknownDecoder).decode(u),
                These.mapLeft((e) => DependencyError.leaf(u, k, e)),
              ),
            ]
          },
        ),
      )
    }

    return output.reduce(concat)
  })
}
