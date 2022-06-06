import * as Encoder from './Encoder'

import { AnyAnnotation } from '@/Annotation/Annotation'
import { AnyConstructor } from '@/Constructor/Constructor'
import * as Decoder from '@/Decoder/Decoder'
import { JsonSchema } from '@/JsonSchema/JsonSchema'
import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class EncoderSchema<
    D extends Decoder.AnyDecoder,
    C extends AnyConstructor,
    E extends Encoder.AnyEncoder,
    J extends JsonSchema<any>,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
    E2 extends Encoder.Encoder<Decoder.OutputOf<D>, any>,
  >
  extends Schema<D, C, E2, J, Api, Annotations>
  implements HasContinuation
{
  static type = 'Decoder'
  readonly type = EncoderSchema.type

  get api() {
    return this.schema.api
  }

  readonly [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<D, C, E, J, Api, Annotations>,
    readonly encode: E2['encode'],
  ) {
    super()
  }
}

export const encode =
  <EI, EO>(encode: Encoder.Encoder<EI, EO>['encode']) =>
  <
    _DI,
    _DE,
    C extends AnyConstructor,
    E extends Encoder.AnyEncoder,
    J extends JsonSchema<any>,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
  >(
    schema: Schema<Decoder.Decoder<_DI, _DE, EI>, C, E, J, Api, Annotations>,
  ): Schema<Decoder.Decoder<_DI, _DE, EI>, C, E, J, Api, Annotations> =>
    new EncoderSchema(schema, encode)
