import { fromRefinment } from './fromRefinement'

import { Guard } from '@/Guard/Guard'

export function fromGuard<A>(G: Guard<A>) {
  return fromRefinment(G.is)
}
