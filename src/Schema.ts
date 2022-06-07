import { Annotation, AnnotationId, AnyAnnotation, ValueOf } from './Annotation/Annotation'
import * as C from './Constructor/Constructor'
import * as D from './Decoder/Decoder'
import * as E from './Encoder/Encoder'
import { JsonSchema } from './JsonSchema/JsonSchema'

export abstract class Schema<
  D extends D.AnyDecoder,
  C extends C.AnyConstructor,
  E extends E.AnyEncoder,
  J extends JsonSchema<any>,
  Api,
  Annotations extends ReadonlyArray<AnyAnnotation>,
> {
  static type: string
  abstract readonly type: string
  abstract get api(): Api

  readonly __NOT_AVAILABLE_AT_RUNTIME__!: {
    readonly _Decoder: () => D
    readonly _Constructor: () => C
    readonly _Encoder: () => E
    readonly _JsonSchema: () => J
    readonly _Api: () => Api
    readonly _Annotations: () => Annotations
  }

  readonly addAnnotation = <Id, A, B extends A>(
    id: AnnotationId<Id, A>,
    value: B,
  ): Schema<D, C, E, J, Api, readonly [...Annotations, Annotation<AnnotationId<Id, A>, B>]> =>
    new SchemaAnnotation(this, [Annotation.make(id, value)] as const)

  readonly addAnnotations = <Appended extends ReadonlyArray<AnyAnnotation>>(
    ...annotations: Appended
  ): Schema<D, C, E, J, Api, readonly [...Annotations, ...Appended]> =>
    new SchemaAnnotation(this, annotations)

  readonly compose = <
    D2 extends D.AnyDecoder,
    C2 extends C.AnyConstructor,
    E2 extends E.AnyEncoder,
    J2 extends JsonSchema<any>,
    Api2,
    Annotations2 extends ReadonlyArray<AnyAnnotation>,
  >(
    right: Schema<D2, C2, E2, J2, Api2, Annotations2>,
  ): Schema<
    D.Decoder<D.IntputOf<D>, D.ErrorOf<D> | D.ErrorOf<D2>, D.OutputOf<D2>>,
    C2,
    E2,
    J2,
    Api2,
    readonly [...Annotations, ...Annotations2]
  > => new SchemaCompose(this, right)
}

export type AnySchema =
  | Schema<any, any, any, any, any, any>
  | Schema<any, any, any, never, any, any>

export const ContinuationSymbol = Symbol('@typed/Schema/Continuation')
export type ContinuationSymbol = typeof ContinuationSymbol

export interface HasContinuation {
  readonly [ContinuationSymbol]: AnySchema
}

export function hasContinuation<
  D extends D.AnyDecoder,
  C extends C.AnyConstructor,
  E extends E.AnyEncoder,
  J extends JsonSchema<any>,
  Api,
  Annotations extends ReadonlyArray<AnyAnnotation>,
>(
  schema: Schema<D, C, E, J, Api, Annotations>,
): schema is Schema<D, C, E, J, Api, Annotations> & HasContinuation {
  return ContinuationSymbol in schema
}

export type GetTypeOf<
  T extends AnySchema,
  K extends keyof T['__NOT_AVAILABLE_AT_RUNTIME__'],
> = T['__NOT_AVAILABLE_AT_RUNTIME__'][K] extends () => infer R ? R : never

export type DecoderOf<T extends AnySchema> = GetTypeOf<T, '_Decoder'>
export type DecoderInputOf<T extends AnySchema> = D.IntputOf<DecoderOf<T>>
export type DecoderErrorOf<T extends AnySchema> = D.ErrorOf<DecoderOf<T>>
export type DecodedOf<T extends AnySchema> = D.OutputOf<DecoderOf<T>>

export type ConstructorOf<T extends AnySchema> = GetTypeOf<T, '_Constructor'>
export type ConstructorInputOf<T extends AnySchema> = D.IntputOf<ConstructorOf<T>>
export type ConstructorErrorOf<T extends AnySchema> = D.ErrorOf<ConstructorOf<T>>
export type ConstructorOutputOf<T extends AnySchema> = D.OutputOf<ConstructorOf<T>>

export type EncoderOf<T extends AnySchema> = GetTypeOf<T, '_Encoder'>
export type EncoderInputOf<T extends AnySchema> = E.InputOf<EncoderOf<T>>
export type EncodedOf<T extends AnySchema> = E.OutputOf<EncoderOf<T>>

export type JsonSchemaOf<T extends AnySchema> = GetTypeOf<T, '_JsonSchema'>

export type ApiOf<T extends AnySchema> = GetTypeOf<T, '_Api'>

export type AnnotationsOf<T extends AnySchema> = GetTypeOf<T, '_Annotations'>

export class SchemaAnnotation<
    D extends D.AnyDecoder,
    C extends C.AnyConstructor,
    E extends E.AnyEncoder,
    J extends JsonSchema<any>,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
    Appended extends ReadonlyArray<AnyAnnotation>,
  >
  extends Schema<D, C, E, J, Api, readonly [...Annotations, ...Appended]>
  implements HasContinuation
{
  static type = 'Annotation'
  readonly type = SchemaAnnotation.type;
  readonly [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<D, C, E, J, Api, Annotations>,
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
  D extends D.AnyDecoder,
  C extends C.AnyConstructor,
  E extends E.AnyEncoder,
  J extends JsonSchema<any>,
  Api,
  Annotations extends ReadonlyArray<AnyAnnotation>,
  D2 extends D.AnyDecoder,
  C2 extends C.AnyConstructor,
  E2 extends E.AnyEncoder,
  J2 extends JsonSchema<any>,
  Api2,
  Annotations2 extends ReadonlyArray<AnyAnnotation>,
> extends Schema<
  D.Decoder<D.IntputOf<D>, D.ErrorOf<D> | D.ErrorOf<D2>, D.OutputOf<D2>>,
  C2,
  E2,
  J2,
  Api2,
  readonly [...Annotations, ...Annotations2]
> {
  static type = 'Compose'
  readonly type = SchemaCompose.type

  constructor(
    readonly left: Schema<D, C, E, J, Api, Annotations>,
    readonly right: Schema<D2, C2, E2, J2, Api2, Annotations2>,
  ) {
    super()
  }

  get api() {
    return this.right.api
  }
}

export const compose =
  <
    D2 extends D.AnyDecoder,
    C2 extends C.AnyConstructor,
    E2 extends E.AnyEncoder,
    J2 extends JsonSchema<any>,
    Api2,
    Annotations2 extends ReadonlyArray<AnyAnnotation>,
  >(
    right: Schema<D2, C2, E2, J2, Api2, Annotations2>,
  ) =>
  <
    D extends D.AnyDecoder,
    C extends C.AnyConstructor,
    E extends E.AnyEncoder,
    J extends JsonSchema<any>,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
  >(
    left: Schema<D, C, E, J, Api, Annotations>,
  ): Schema<
    D.Decoder<D.IntputOf<D>, D.ErrorOf<D> | D.ErrorOf<D2>, D.OutputOf<D2>>,
    C2,
    E2,
    J2,
    Api2,
    readonly [...Annotations, ...Annotations2]
  > =>
    new SchemaCompose(left, right)
