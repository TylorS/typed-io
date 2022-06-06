import { Refinement } from 'hkt-ts/Refinement'

export interface Guard<A> {
  readonly is: Refinement<unknown, A>
}

export function Guard<A>(is: Guard<A>['is']): Guard<A> {
  return {
    is,
  }
}

export const array = <A>(guard: Guard<A>): Guard<readonly A[]> => ({
  is: (u): u is readonly A[] => Array.isArray(u) && u.every(guard.is),
})
