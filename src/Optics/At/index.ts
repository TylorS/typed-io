import { Lens } from '@/Lens/Lens'

export interface At<Ix, I, O> {
  readonly at: (index: Ix) => Lens<I, O>
}
