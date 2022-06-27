import { ReadonlyRecord } from 'hkt-ts/Record'
import { Left } from 'hkt-ts/These'
import { IntersectOf } from 'ts-toolbelt/out/Union/IntersectOf'

import { Decoder, ErrorOf, InputOf } from './Decoder'
import { isUnknownRecord } from './isUnknownRecord'

import { ToRoseTree, UnknownRecordError } from '@/SchemaError/BuiltinErrors'

export type SumInput<Decoders> = IntersectOf<InputOf<Decoders[keyof Decoders]>>
export type SumError<Decoders> = ErrorOf<Decoders[keyof Decoders]>

type UnknownDecoder<A> = Decoder<unknown, ToRoseTree, A> | Decoder<unknown, never, A>

export const sum =
  <T extends ReadonlyRecord<string, any>>() =>
  <Tag extends keyof T>(tag: Tag) =>
  <Decoders extends SumDecoders<T, Tag>>(
    decoders: Decoders,
  ): Decoder<SumInput<Decoders>, SumError<Decoders>, T> => ({
    decode: (i) => {
      if (!isUnknownRecord(i) || !(tag in i)) {
        return Left(UnknownRecordError.leaf(i))
      }

      return decoders[i[tag]].decode(i) as any
    },
  })

export type SumDecoders<T, Tag extends keyof T> = {
  readonly [K in T[Tag] & PropertyKey]: FindSumDecoder<T, Tag, K>
}

export type FindSumDecoder<T, Tag extends keyof T, K extends T[Tag]> = T extends {
  readonly [_ in Tag]: K
}
  ? UnknownDecoder<T>
  : never
