import { AnyAnnotation } from '@/Annotation/Annotation'
import { AnyConstructor } from '@/Constructor/Constructor'
import * as Decoder from '@/Decoder/Decoder'
import { AnyEncoder } from '@/Encoder/Encoder'
import { JsonSchema } from '@/JsonSchema/JsonSchema'
import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class DebugSchema<
    D extends Decoder.AnyDecoder,
    C extends AnyConstructor,
    E extends AnyEncoder,
    J extends JsonSchema<any>,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
  >
  extends Schema<D, C, E, J, Api, Annotations>
  implements HasContinuation
{
  static type = 'Debug' as const
  readonly type = DebugSchema.type

  get api() {
    return this.schema.api
  }

  [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<D, C, E, J, Api, Annotations>,
    readonly debug: (output: Decoder.OutputOf<D>) => string,
  ) {
    super()
  }
}

export const debug =
  <O>(debug: (output: O) => string) =>
  <
    DI,
    DE,
    C extends AnyConstructor,
    E extends AnyEncoder,
    J extends JsonSchema<any>,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
  >(
    schema: Schema<Decoder.Decoder<DI, DE, O>, C, E, J, Api, Annotations>,
  ): Schema<Decoder.Decoder<DI, DE, O>, C, E, J, Api, Annotations> =>
    new DebugSchema(schema, debug)
