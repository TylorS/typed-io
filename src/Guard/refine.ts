import { Refinement } from 'hkt-ts/Refinement'

import { Guard } from './Guard'

export const refine =
  <A, B extends A>(refinement: Refinement<A, B>) =>
  (guard: Guard<A>): Guard<B> => ({
    is: (u): u is B => guard.is(u) && refinement(u),
  })
