import { Optional } from '@/Optics/Optional'

export interface Indexed<Ix, I, O> {
  readonly index: (i: Ix) => Optional<I, O>
}

export function Indexed<Ix, I, O>(index: Indexed<Ix, I, O>['index']): Indexed<Ix, I, O> {
  return {
    index,
  }
}
