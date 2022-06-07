export interface Encoder<I, O> {
  readonly encode: (i: I) => O
}

export type AnyEncoder = Encoder<any, any>

export function Encoder<I, O>(encode: Encoder<I, O>['encode']): Encoder<I, O> {
  return {
    encode,
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export type InputOf<T> = [T] extends [Encoder<infer R, infer _>] ? R : never
export type OutputOf<T> = [T] extends [Encoder<infer _, infer R>] ? R : never
/* eslint-enable @typescript-eslint/no-unused-vars */
