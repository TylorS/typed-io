import { These } from 'hkt-ts/These'

export interface Decoder<I, E, O> {
  readonly decode: (input: I) => These<E, O>
}

export function Decoder<I, E, O>(decode: Decoder<I, E, O>['decode']): Decoder<I, E, O> {
  return {
    decode,
  }
}
