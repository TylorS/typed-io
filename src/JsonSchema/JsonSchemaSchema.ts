import { AnyAnnotation } from '@/Annotation/Annotation'
import { AnyConstructor } from '@/Constructor/Constructor'
import * as Decoder from '@/Decoder/Decoder'
import * as Encoder from '@/Encoder/Encoder'
import { JsonSchema } from '@/JsonSchema/JsonSchema'
import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class JsonSchemaSchema<
    D extends Decoder.AnyDecoder,
    C extends AnyConstructor,
    E extends Encoder.AnyEncoder,
    J extends JsonSchema<any>,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
    J2 extends JsonSchema<Decoder.OutputOf<D>>,
  >
  extends Schema<D, C, E, J2, Api, Annotations>
  implements HasContinuation
{
  static type = 'Decoder'
  readonly type = JsonSchemaSchema.type

  get api() {
    return this.schema.api
  }

  readonly [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<D, C, E, J, Api, Annotations>,
    readonly jsonSchema: (J: typeof import('@/JsonSchema/JsonSchema')) => J2,
  ) {
    super()
  }
}

export const jsonSchema =
  <O>(jsonSchema: (J: typeof import('@/JsonSchema/JsonSchema')) => JsonSchema<O>) =>
  <
    _DI,
    _DE,
    C extends AnyConstructor,
    E extends Encoder.AnyEncoder,
    J extends JsonSchema<any>,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
  >(
    schema: Schema<Decoder.Decoder<_DI, _DE, O>, C, E, J, Api, Annotations>,
  ): Schema<Decoder.Decoder<_DI, _DE, O>, C, E, JsonSchema<O>, Api, Annotations> =>
    new JsonSchemaSchema(schema, jsonSchema)
