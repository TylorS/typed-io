import { Annotation, AnnotationId, AnyAnnotation, ValueOf } from './Annotation/Annotation'
import { AnyConstructor } from './Constructor/Constructor'
import * as D from './Decoder/Decoder'
import { AnyEncoder } from './Encoder/Encoder'
import { JsonSchema } from './JsonSchema/JsonSchema'

export abstract class Schema<
  D extends D.AnyDecoder,
  C extends AnyConstructor,
  E extends AnyEncoder,
  J extends JsonSchema<any>,
  Api,
  Annotations extends ReadonlyArray<AnyAnnotation>,
> {
  static type: string
  abstract readonly type: string
  abstract get api(): Api

  readonly __NOT_AVAILABLE_AT_RUNTIME__!: {
    readonly _Decoder: D
    readonly _Constructor: C
    readonly _Encoder: E
    readonly _JsonSchema: J
    readonly _Api: Api
    readonly _Annotations: Annotations
  }

  readonly addAnnotation = <Id, A>(
    id: AnnotationId<Id, A>,
    value: A,
  ): Schema<D, C, E, J, Api, readonly [...Annotations, Annotation<Id, A>]> =>
    new SchemaAnnotation(this, [Annotation.make(id, value)] as const)

  readonly addAnnotations = <Appended extends ReadonlyArray<AnyAnnotation>>(
    ...annotations: Appended
  ): Schema<D, C, E, J, Api, readonly [...Annotations, ...Appended]> =>
    new SchemaAnnotation(this, annotations)

  readonly compose = <
    D2 extends D.AnyDecoder,
    C2 extends AnyConstructor,
    E2 extends AnyEncoder,
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
  C extends AnyConstructor,
  E extends AnyEncoder,
  J extends JsonSchema<any>,
  Api,
  Annotations extends ReadonlyArray<AnyAnnotation>,
>(
  schema: Schema<D, C, E, J, Api, Annotations>,
): schema is Schema<D, C, E, J, Api, Annotations> & HasContinuation {
  return ContinuationSymbol in schema
}

export type DecoderOf<T extends AnySchema> = T['__NOT_AVAILABLE_AT_RUNTIME__']['_Decoder']
export type Constructorf<T extends AnySchema> = T['__NOT_AVAILABLE_AT_RUNTIME__']['_Constructor']
export type EncoderOf<T extends AnySchema> = T['__NOT_AVAILABLE_AT_RUNTIME__']['_Encoder']
export type JsonSchemaOf<T extends AnySchema> = T['__NOT_AVAILABLE_AT_RUNTIME__']['_JsonSchema']
export type ApiOf<T extends AnySchema> = T['__NOT_AVAILABLE_AT_RUNTIME__']['_Api']
export type AnnotationsOf<T extends AnySchema> = T['__NOT_AVAILABLE_AT_RUNTIME__']['_Annotations']

export class SchemaAnnotation<
    D extends D.AnyDecoder,
    C extends AnyConstructor,
    E extends AnyEncoder,
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
  C extends AnyConstructor,
  E extends AnyEncoder,
  J extends JsonSchema<any>,
  Api,
  Annotations extends ReadonlyArray<AnyAnnotation>,
  D2 extends D.AnyDecoder,
  C2 extends AnyConstructor,
  E2 extends AnyEncoder,
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
    C2 extends AnyConstructor,
    E2 extends AnyEncoder,
    J2 extends JsonSchema<any>,
    Api2,
    Annotations2 extends ReadonlyArray<AnyAnnotation>,
  >(
    right: Schema<D2, C2, E2, J2, Api2, Annotations2>,
  ) =>
  <
    D extends D.AnyDecoder,
    C extends AnyConstructor,
    E extends AnyEncoder,
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
