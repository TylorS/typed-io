import { Optional } from '@/Optional/Optional'

export interface Indexed<Ix, I, O> {
  readonly index: (i: Ix) => Optional<I, O>
}
