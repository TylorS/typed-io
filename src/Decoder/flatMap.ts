import { These } from 'hkt-ts/These'
import { flow, pipe } from 'hkt-ts/function'

import { Decoder } from './Decoder'

import { SchemaError, makeSchemaErrorFlatMap } from '@/SchemaError/SchemaError'

const flatMapError = makeSchemaErrorFlatMap<any>('')

export const flatMap =
  <A, I2, E2, B>(f: (a: A) => Decoder<I2, E2, B>) =>
  <I, E>(decoder: Decoder<I, E, A>): Decoder<I & I2, E | E2, B> => ({
    decode: (i) =>
      pipe(
        i,
        decoder.decode,
        flatMapError((a) => f(a).decode(i)),
      ),
  })

export const flatMapThese =
  <A, E2, B>(f: (a: A) => These<SchemaError<E2>, B>) =>
  <I, E>(decoder: Decoder<I, E, A>): Decoder<I, E | E2, B> => ({
    decode: flow(decoder.decode, flatMapError(f)),
  })
