import { pipe } from 'hkt-ts'
import * as NonEmptyArray from 'hkt-ts/NonEmptyArray'
import * as These from 'hkt-ts/These'
import * as S from 'hkt-ts/struct'

import { AnyDecoder, Decoder, ErrorOf, InputOf, OutputOf } from './Decoder'

import { ToIntersection } from '@/JsonSchema2/intersection'
import { makeSchemaErrorAssociative } from '@/SchemaError/SchemaError'

export type IntersectionInput<Decoders extends ReadonlyArray<AnyDecoder>> = ToIntersection<{
  readonly [K in keyof Decoders]: InputOf<Decoders[K]>
}>

export type IntersectionError<Decoders extends ReadonlyArray<AnyDecoder>> = {
  readonly [K in keyof Decoders]: ErrorOf<Decoders[K]>
}[number]

export type IntersectionOutput<Decoders extends ReadonlyArray<AnyDecoder>> = ToIntersection<{
  readonly [K in keyof Decoders]: OutputOf<Decoders[K]>
}>

export const intersection = <Decoders extends NonEmptyArray.NonEmptyArray<AnyDecoder>>(
  ...decoders: Decoders
): Decoder<
  IntersectionInput<Decoders>,
  IntersectionError<Decoders>,
  IntersectionOutput<Decoders>
> => {
  const foldLeft = NonEmptyArray.foldLeft(
    These.makeIdentity(
      makeSchemaErrorAssociative<IntersectionError<Decoders>>(''),
      S.makeAssignIdentity<any>(),
    ),
  )
  return {
    decode: (i) =>
      pipe(
        decoders,
        NonEmptyArray.map((d) => d.decode(i)),
        foldLeft,
      ),
  }
}
