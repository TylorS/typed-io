import { Refinement } from 'hkt-ts/Refinement'

export interface Guard<A> {
  readonly is: Refinement<unknown, A>
}
