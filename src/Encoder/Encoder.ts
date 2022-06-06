export interface Encoder<I, O> {
  readonly encode: (i: I) => O
}

export type AnyEncoder = Encoder<any, any>

export function Encoder<I, O>(encode: Encoder<I, O>['encode']): Encoder<I, O> {
  return {
    encode,
  }
}
