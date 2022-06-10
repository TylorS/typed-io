import { makeFlatMap } from 'hkt-ts/These'
import { flow } from 'hkt-ts/function'

import { Decoder } from './Decoder'

import { makeAssociative } from '@/SchemaError/SchemaError'

const flatMap = makeFlatMap(makeAssociative<any>())

export const compose =
  <A, E2, O>(right: Decoder<A, E2, O>) =>
  <I, E>(left: Decoder<I, E, A>): Decoder<I, E | E2, O> => ({
    decode: flow(left.decode, flatMap(right.decode)),
  })
