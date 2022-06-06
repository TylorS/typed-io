import { These } from 'hkt-ts/These'

import { SchemaError } from '@/SchemaError/SchemaError'

export interface Constructor<I, E, O> {
  readonly construct: (input: I) => These<SchemaError<E>, O>
}

export type AnyConstructor = Constructor<any, any, any> | Constructor<any, never, any>

export function Constructor<I, E, O>(
  construct: Constructor<I, E, O>['construct'],
): Constructor<I, E, O> {
  return {
    construct,
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export type IntputOf<T> = [T] extends [Constructor<infer R, infer _, infer __>] ? R : never
export type ErrorOf<T> = [T] extends [Constructor<infer _, infer R, infer __>] ? R : never
export type OutputOf<T> = [T] extends [Constructor<infer _, infer __, infer R>] ? R : never
/* eslint-enable @typescript-eslint/no-unused-vars */
