export interface Encoder<I, O> {
  readonly encode: (i: I) => O
}

export function Encoder<I, O>(encode: Encoder<I, O>['encode']): Encoder<I, O> {
  return {
    encode,
  }
}
