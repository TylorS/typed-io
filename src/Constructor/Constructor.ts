import { These } from 'hkt-ts/These'

export interface Constructor<I, E, O> {
  readonly construct: (input: I) => These<E, O>
}

export function Constructor<I, E, O>(
  construct: Constructor<I, E, O>['construct'],
): Constructor<I, E, O> {
  return {
    construct,
  }
}
