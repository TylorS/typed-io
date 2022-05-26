import { These } from 'hkt-ts/These'

export interface Constructor<I, E, O> {
  readonly construct: (input: I) => These<E, O>
}
