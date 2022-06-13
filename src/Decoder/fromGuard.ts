import { fromRefinment } from './fromRefinement'

import { Guard } from '@/Guard/Guard'

export function fromGuard<A, E>(G: Guard<A>, onError: (u: unknown) => E) {
  return fromRefinment(G.is, onError)
}
