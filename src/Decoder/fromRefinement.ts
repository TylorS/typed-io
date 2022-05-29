import { Left, Right } from 'hkt-ts/Either'
import { Refinement } from 'hkt-ts/Refinement'

import { Decoder } from './Decoder'

export function fromRefinment<A, B extends A>(
  refinement: Refinement<A, B>,
): RefinementDecoder<A, B> {
  return new RefinementDecoder<A, B>(refinement)
}

export class RefinementDecoder<A, B extends A> implements Decoder<A, RefinementError<A, B>, B> {
  constructor(readonly refinement: Refinement<A, B>) {}

  readonly decode = (a: A) =>
    this.refinement(a) ? Right(a) : Left(new RefinementError(a, this.refinement))
}

export class RefinementError<A, B extends A> {
  static tag = 'Refinement'
  readonly tag = 'Refinement'

  constructor(readonly input: A, readonly refinement: Refinement<A, B>) {}
}