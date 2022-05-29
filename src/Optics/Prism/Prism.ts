import { Maybe } from 'hkt-ts/Maybe'

export interface Prism<A, B> {
  readonly get: (a: A) => Maybe<B>
  readonly reverse: (b: B) => A
}

export function Prism<A, B>(get: Prism<A, B>['get'], reverse: Prism<A, B>['reverse']): Prism<A, B> {
  return {
    get,
    reverse,
  }
}
