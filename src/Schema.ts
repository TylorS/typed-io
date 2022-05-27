import { Refinement } from 'hkt-ts/Refinement'

/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class Schema<
  DecodeInput,
  DecodeError,
  Decoded,
  ConstructorInput,
  ConstructorError,
  Encoded,
  Api,
  Annotations,
> {
  static type: string
  abstract readonly type: string
  abstract get api(): Api

  readonly __VARIANCE_NOT_AVAILABLE_AT_RUNTIME__!: {
    readonly _DecodeInput: (i: DecodeInput) => never
    readonly _DecodeError: () => DecodeError
    readonly _Decoded: () => Decoded
    readonly _ConstructorInput: (i: ConstructorInput) => never
    readonly _ConstructorError: () => ConstructorError
    readonly _Encoded: () => Encoded
    readonly _Api: () => Api
    readonly _Annotations: (a: Annotations) => never
  }
}

export type AnySchema =
  | Schema<any, any, any, any, any, any, any, any>
  | Schema<any, never, any, any, any, any, any, any>
  | Schema<any, any, any, any, never, any, any, any>
  | Schema<any, never, any, any, never, any, any, any>

export const ContinuationSymbol = Symbol('@typed/Schema/Continuation')
export type ContinuationSymbol = typeof ContinuationSymbol

export interface HasContinuation {
  readonly [ContinuationSymbol]: AnySchema
}

export function hasContinuation<
  DecoderInput,
  DecodeError,
  Decoded,
  ConstructorInput,
  ConstructorError,
  Encoded,
  Api,
  Annotations,
>(
  schema: Schema<
    DecoderInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations
  >,
): schema is Schema<
  DecoderInput,
  DecodeError,
  Decoded,
  ConstructorInput,
  ConstructorError,
  Encoded,
  Api,
  Annotations
> &
  HasContinuation {
  return ContinuationSymbol in schema
}

export type DecoderInputOf<T> = [T] extends [
  Schema<
    infer R,
    infer __,
    infer ___,
    infer ____,
    infer _____,
    infer ______,
    infer _______,
    infer _________
  >,
]
  ? R
  : never

export type DecoderErrorOf<T> = [T] extends [
  Schema<
    infer _,
    infer R,
    infer ___,
    infer ____,
    infer _____,
    infer ______,
    infer _______,
    infer _________
  >,
]
  ? R
  : never

export type DecodedOf<T> = [T] extends [
  Schema<
    infer _,
    infer __,
    infer R,
    infer ____,
    infer _____,
    infer ______,
    infer _______,
    infer _________
  >,
]
  ? R
  : never

export type ConstructorInputOf<T> = [T] extends [
  Schema<
    infer _,
    infer __,
    infer ___,
    infer R,
    infer _____,
    infer ______,
    infer _______,
    infer _________
  >,
]
  ? R
  : never

export type ConstructorErrorOf<T> = [T] extends [
  Schema<
    infer _,
    infer __,
    infer ___,
    infer ____,
    infer R,
    infer ______,
    infer _______,
    infer _________
  >,
]
  ? R
  : never

export type EncodedOf<T> = [T] extends [
  Schema<
    infer _,
    infer __,
    infer ___,
    infer ____,
    infer _____,
    infer R,
    infer _______,
    infer _________
  >,
]
  ? R
  : never

export type ApiOf<T> = [T] extends [
  Schema<
    infer _,
    infer __,
    infer ___,
    infer ____,
    infer _____,
    infer ______,
    infer R,
    infer _________
  >,
]
  ? R
  : never

export type AnnotationsOf<T> = [T] extends [
  Schema<
    infer _,
    infer __,
    infer ___,
    infer ____,
    infer _____,
    infer ______,
    infer _________,
    infer R
  >,
]
  ? R
  : never

// eslint-disable-next-line @typescript-eslint/ban-types
export class SchemaIdentity<A> extends Schema<unknown, never, A, A, never, A, {}, {}> {
  static type = 'Identity'
  readonly type = SchemaIdentity.type

  constructor(readonly refinement: Refinement<unknown, A>) {
    super()
  }

  get api() {
    return {}
  }
}
