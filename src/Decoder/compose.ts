import { flow } from 'hkt-ts/function'

import { Decoder } from './Decoder'

import { makeSchemaErrorFlatMap } from '@/SchemaError/SchemaError'

const flatMap = makeSchemaErrorFlatMap<any>('')

export const compose =
  <A, E2, O>(right: Decoder<A, E2, O>) =>
  <I, E>(left: Decoder<I, E, A>): Decoder<I, E | E2, O> => ({
    decode: flow(left.decode, flatMap(right.decode)),
  })
