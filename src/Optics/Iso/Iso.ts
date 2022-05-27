export interface Iso<A, B> {
  readonly get: (a: A) => B
  readonly reverse: (b: B) => A
}
