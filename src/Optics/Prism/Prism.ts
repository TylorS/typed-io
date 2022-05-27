import { Maybe } from 'hkt-ts/Maybe'

export interface Prism<A, B> {
  readonly get: (a: A) => Maybe<B>
  readonly reverse: (b: B) => A
}
