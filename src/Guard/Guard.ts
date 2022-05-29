import { Refinement } from 'hkt-ts/Refinement'

export interface Guard<A> {
  readonly is: Refinement<unknown, A>
}

export function Guard<A>(is: Guard<A>['is']): Guard<A> {
  return {
    is,
  }
}
