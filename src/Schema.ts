import { Annotation, AnnotationId, AnyAnnotation, ValueOf } from './Annotation/Annotation'

/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class Schema<
  DecodeInput,
  DecodeError,
  Decoded,
  ConstructorInput,
  ConstructorError,
  Encoded,
  Api,
  Annotations extends ReadonlyArray<AnyAnnotation>,
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

  readonly addAnnotation = <Id, A>(
    id: AnnotationId<Id, A>,
    value: A,
  ): Schema<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    readonly [...Annotations, Annotation<Id, A>]
  > => new SchemaAnnotation(this, [Annotation.make(id, value)])

  readonly compose = <
    DecodeError2,
    Decoded2,
    ConstructorInput2,
    ConstructorError2,
    Encoded2,
    Api2,
    Annotations2 extends ReadonlyArray<AnyAnnotation>,
  >(
    right: Schema<
      Decoded,
      DecodeError2,
      Decoded2,
      ConstructorInput2,
      ConstructorError2,
      Encoded2,
      Api2,
      Annotations2
    >,
  ): Schema<
    DecodeInput,
    DecodeError | DecodeError2,
    Decoded2,
    ConstructorInput2,
    ConstructorError2,
    Encoded2,
    Api2,
    readonly [...Annotations, ...Annotations2]
  > => new SchemaCompose(this, right)
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
  Annotations extends ReadonlyArray<any>,
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
  : []

export class SchemaAnnotation<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
    Appended extends ReadonlyArray<AnyAnnotation>,
  >
  extends Schema<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    readonly [...Annotations, ...Appended]
  >
  implements HasContinuation
{
  static type = 'Annotation'
  readonly type = SchemaAnnotation.type;
  readonly [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<
      DecodeInput,
      DecodeError,
      Decoded,
      ConstructorInput,
      ConstructorError,
      Encoded,
      Api,
      Annotations
    >,
    readonly annotations: Appended,
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}

export type ToAnnotations<Ids extends ReadonlyArray<any>> = Ids extends readonly [
  infer Head,
  ...infer Tail,
]
  ? readonly [Annotation<Head, ValueOf<Head>>, ...ToAnnotations<Tail>]
  : []

export class SchemaCompose<
  DecodeInput1,
  DecodeError1,
  Decoded1,
  ConstructorInput1,
  ConstructorError1,
  Encoded1,
  Api1,
  Annotations1 extends ReadonlyArray<AnyAnnotation>,
  DecodeError2,
  Decoded2,
  ConstructorInput2,
  ConstructorError2,
  Encoded2,
  Api2,
  Annotations2 extends ReadonlyArray<AnyAnnotation>,
> extends Schema<
  DecodeInput1,
  DecodeError1 | DecodeError2,
  Decoded2,
  ConstructorInput2,
  ConstructorError2,
  Encoded2,
  Api2,
  readonly [...Annotations1, ...Annotations2]
> {
  static type = 'Compose'
  readonly type = SchemaCompose.type

  constructor(
    readonly left: Schema<
      DecodeInput1,
      DecodeError1,
      Decoded1,
      ConstructorInput1,
      ConstructorError1,
      Encoded1,
      Api1,
      Annotations1
    >,
    readonly right: Schema<
      Decoded1,
      DecodeError2,
      Decoded2,
      ConstructorInput2,
      ConstructorError2,
      Encoded2,
      Api2,
      Annotations2
    >,
  ) {
    super()
  }

  get api() {
    return this.right.api
  }
}

export const compose =
  <
    Decoded1,
    DecodeError2,
    Decoded2,
    ConstructorInput2,
    ConstructorError2,
    Encoded2,
    Api2,
    Annotations2 extends ReadonlyArray<AnyAnnotation>,
  >(
    right: Schema<
      Decoded1,
      DecodeError2,
      Decoded2,
      ConstructorInput2,
      ConstructorError2,
      Encoded2,
      Api2,
      Annotations2
    >,
  ) =>
  <
    DecodeInput1,
    DecodeError1,
    ConstructorInput1,
    ConstructorError1,
    Encoded1,
    Api1,
    Annotations1 extends ReadonlyArray<AnyAnnotation>,
  >(
    left: Schema<
      DecodeInput1,
      DecodeError1,
      Decoded1,
      ConstructorInput1,
      ConstructorError1,
      Encoded1,
      Api1,
      Annotations1
    >,
  ): Schema<
    DecodeInput1,
    DecodeError1 | DecodeError2,
    Decoded2,
    ConstructorInput2,
    ConstructorError2,
    Encoded2,
    Api2,
    readonly [...Annotations1, ...Annotations2]
  > =>
    new SchemaCompose(left, right)
