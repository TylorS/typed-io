export interface Lens<A, B> {
  readonly get: (a: A) => B
  readonly set: (b: B) => (a: A) => B
}
