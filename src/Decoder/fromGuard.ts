import { fromRefinement } from './fromRefinement'

import { Guard } from '@/Guard/Guard'

export function fromGuard<A, E>(G: Guard<A>, onError: (u: unknown) => E) {
  return fromRefinement(G.is, onError)
}
