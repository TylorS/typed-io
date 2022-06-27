import { HKT, Params } from 'hkt-ts'

export interface Arbitrary<A> {
  readonly arbitrary: (fc: typeof import('fast-check')) => import('fast-check').Arbitrary<A>
}

export function Arbitrary<A>(
  arbitrary: (fc: typeof import('fast-check')) => import('fast-check').Arbitrary<A>,
): Arbitrary<A> {
  return {
    arbitrary,
  }
}

export interface ArbitraryHKT extends HKT {
  readonly type: Arbitrary<this[Params.A]>
}
