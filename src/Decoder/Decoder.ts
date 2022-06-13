import { HKT3, Params } from 'hkt-ts'
import { These } from 'hkt-ts/These'

import { SchemaError } from '@/SchemaError/SchemaError'

export interface Decoder<I, E, O> {
  readonly decode: (input: I) => These<SchemaError<E>, O>
}

export type AnyDecoder = Decoder<any, any, any> | Decoder<any, never, any>

export function Decoder<I, E, O>(decode: Decoder<I, E, O>['decode']): Decoder<I, E, O> {
  return {
    decode,
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export type IntputOf<T> = [T] extends [Decoder<infer R, infer _, infer __>] ? R : never
export type ErrorOf<T> = [T] extends [Decoder<infer _, infer R, infer __>] ? R : never
export type OutputOf<T> = [T] extends [Decoder<infer _, infer __, infer R>] ? R : never
/* eslint-enable @typescript-eslint/no-unused-vars */

export interface DecoderHKT extends HKT3 {
  readonly type: Decoder<this[Params.R], this[Params.E], this[Params.A]>
}
