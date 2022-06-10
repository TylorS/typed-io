import { pipe } from 'hkt-ts'
import { Refinement } from 'hkt-ts/Refinement'

import { Decoder } from './Decoder'
import { compose } from './compose'
import { RefinementError, fromRefinment } from './fromRefinement'

export const refine =
  <A, B extends A>(refinement: Refinement<A, B>) =>
  <I, E>(decoder: Decoder<I, E, A>): Decoder<I, E | RefinementError<A, B>, B> =>
    pipe(decoder, compose(fromRefinment(refinement)))
