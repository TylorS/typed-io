import { Maybe } from 'hkt-ts/Maybe'

export interface Optional<A, B> {
  readonly get: (a: A) => Maybe<B>
  readonly set: (b: B) => (a: A) => B
}

export function Optional<A, B>(
  get: Optional<A, B>['get'],
  set: Optional<A, B>['set'],
): Optional<A, B> {
  return {
    get,
    set,
  }
}
