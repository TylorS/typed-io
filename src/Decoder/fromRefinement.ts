import { Left, Right } from 'hkt-ts/Either'
import { Refinement } from 'hkt-ts/Refinement'

import { Decoder } from './Decoder'

import { LeafError } from '@/SchemaError/SchemaError'

export function fromRefinment<A, B extends A>(
  refinement: Refinement<A, B>,
): Decoder<A, RefinementError<A, B>, B> {
  return new RefinementDecoder<A, B>(refinement)
}

export class RefinementDecoder<A, B extends A> implements Decoder<A, RefinementError<A, B>, B> {
  static tag = 'Refinement'
  readonly tag = RefinementDecoder.tag

  constructor(readonly refinement: Refinement<A, B>) {}

  readonly decode = (a: A) =>
    this.refinement(a) ? Right(a) : Left(new LeafError(new RefinementError(a, this.refinement)))
}

export class RefinementError<A, B extends A> {
  static tag = 'Refinement'
  readonly tag = 'Refinement'

  constructor(readonly input: A, readonly refinement: Refinement<A, B>) {}
}
