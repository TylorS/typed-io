export interface Arbitrary<A> {
  readonly arbitrary: (fc: typeof import('fast-check')) => import('fast-check').Arbitrary<A>
}
