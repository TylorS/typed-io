export interface Lens<A, B> {
  readonly get: (a: A) => B
  readonly set: (b: B) => (a: A) => B
}

export function Lens<A, B>(get: Lens<A, B>['get'], set: Lens<A, B>['set']): Lens<A, B> {
  return {
    get,
    set,
  }
}
