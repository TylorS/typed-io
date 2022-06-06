import { AnyAnnotation } from '@/Annotation/Annotation'
import { AnyConstructor } from '@/Constructor/Constructor'
import * as Decoder from '@/Decoder/Decoder'
import { AnyEncoder } from '@/Encoder/Encoder'
import { JsonSchema } from '@/JsonSchema/JsonSchema'
import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class GuardSchema<
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
  static type = 'Guard' as const
  readonly type = GuardSchema.type

  get api() {
    return this.schema.api
  }

  [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<D, C, E, J, Api, Annotations>,
    readonly guard: (u: unknown) => u is Decoder.OutputOf<D>,
  ) {
    super()
  }
}

export const guard =
  <O>(guard: (u: unknown) => u is O) =>
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
    new GuardSchema(schema, guard)
