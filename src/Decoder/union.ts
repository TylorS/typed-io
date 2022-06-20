import { NonEmptyArray } from 'hkt-ts/NonEmptyArray'
import { Left, isLeft } from 'hkt-ts/These'

import { AnyDecoder, Decoder, ErrorOf, IntputOf, OutputOf } from './Decoder'

import { ToIntersection } from '@/JsonSchema2/intersection'
import { SchemaError, makeSchemaErrorAssociative } from '@/SchemaError/SchemaError'

export type UnionInput<Decoders extends ReadonlyArray<AnyDecoder>> = ToIntersection<{
  readonly [K in keyof Decoders]: IntputOf<Decoders[K]>
}>
export type UnionError<Decoders extends ReadonlyArray<AnyDecoder>> = {
  readonly [K in keyof Decoders]: ErrorOf<Decoders[K]>
}[number]
export type UnionOutput<Decoders extends ReadonlyArray<AnyDecoder>> = {
  readonly [K in keyof Decoders]: OutputOf<Decoders[K]>
}[number]

export const union = <Decoders extends NonEmptyArray<AnyDecoder>>(
  ...decoders: Decoders
): Decoder<UnionInput<Decoders>, UnionError<Decoders>, UnionOutput<Decoders>> => ({
  decode: (i) => {
    const errors: SchemaError<UnionError<Decoders>>[] = []

    for (const decoder of decoders) {
      const result = decoder.decode(i)

      if (isLeft(result)) {
        errors.push(result.left)
      } else {
        return result
      }
    }

    return Left(errors.reduce(makeSchemaErrorAssociative<any>('').concat))
  },
})
