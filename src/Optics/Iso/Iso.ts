export interface Iso<A, B> {
  readonly get: (a: A) => B
  readonly reverse: (b: B) => A
}

export function Iso<A, B>(get: Iso<A, B>['get'], reverse: Iso<A, B>['reverse']): Iso<A, B> {
  return {
    get,
    reverse,
  }
}
