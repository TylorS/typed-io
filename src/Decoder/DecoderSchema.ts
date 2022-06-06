import * as Decoder from './Decoder'

import { AnyAnnotation } from '@/Annotation/Annotation'
import { AnyConstructor } from '@/Constructor/Constructor'
import { AnyEncoder } from '@/Encoder/Encoder'
import { JsonSchema } from '@/JsonSchema/JsonSchema'
import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class DecoderSchema<
    D extends Decoder.AnyDecoder,
    C extends AnyConstructor,
    E extends AnyEncoder,
    J extends JsonSchema<any>,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
    D2 extends Decoder.Decoder<any, any, Decoder.OutputOf<D>>,
  >
  extends Schema<D2, C, E, J, Api, Annotations>
  implements HasContinuation
{
  static type = 'Decoder'
  readonly type = DecoderSchema.type

  get api() {
    return this.schema.api
  }

  readonly [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<D, C, E, J, Api, Annotations>,
    readonly decode: D2['decode'],
  ) {
    super()
  }
}

export const decode =
  <DI, DE, DO>(construct: Decoder.Decoder<DI, DE, DO>['decode']) =>
  <
    _DI,
    _DE,
    C extends AnyConstructor,
    E extends AnyEncoder,
    J extends JsonSchema<any>,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
  >(
    schema: Schema<Decoder.Decoder<_DI, _DE, DO>, C, E, J, Api, Annotations>,
  ): Schema<Decoder.Decoder<DI, DE, DO>, C, E, J, Api, Annotations> =>
    new DecoderSchema(schema, construct)
