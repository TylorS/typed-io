import { Left, Right } from 'hkt-ts/Either'
import { Refinement } from 'hkt-ts/Refinement'

import { Decoder } from './Decoder'

import { LeafError } from '@/SchemaError/SchemaError'

export function fromRefinment<A, B extends A, E>(
  refinement: Refinement<A, B>,
  onError: (a: A) => E,
): Decoder<A, E, B> {
  return new RefinementDecoder<A, B, E>(refinement, onError)
}

export class RefinementDecoder<A, B extends A, E> implements Decoder<A, E, B> {
  static tag = 'Refinement'
  readonly tag = RefinementDecoder.tag

  constructor(readonly refinement: Refinement<A, B>, readonly onError: (a: A) => E) {}

  readonly decode = (a: A) => (this.refinement(a) ? Right(a) : Left(new LeafError(this.onError(a))))
}
