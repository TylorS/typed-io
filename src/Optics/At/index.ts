import { Lens } from '@/Optics/Lens'

export interface At<Ix, I, O> {
  readonly at: (index: Ix) => Lens<I, O>
}

export function At<Ix, I, O>(at: At<Ix, I, O>['at']): At<Ix, I, O> {
  return {
    at,
  }
}
