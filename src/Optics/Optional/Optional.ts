import { Maybe } from 'hkt-ts/Maybe'

export interface Optional<A, B> {
  readonly get: (a: A) => Maybe<B>
  readonly set: (b: B) => (a: A) => B
}
