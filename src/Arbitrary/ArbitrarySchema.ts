import { AnyAnnotation } from '@/Annotation/Annotation'
import { AnyConstructor } from '@/Constructor/Constructor'
import * as Decoder from '@/Decoder/Decoder'
import { AnyEncoder } from '@/Encoder/Encoder'
import { JsonSchema } from '@/JsonSchema/JsonSchema'
import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class ArbitrarySchema<
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
  static type = 'Arbitrary' as const
  readonly type = ArbitrarySchema.type

  get api() {
    return this.schema.api
  }

  [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<D, C, E, J, Api, Annotations>,
    readonly arbitrary: (
      fc: typeof import('fast-check'),
    ) => import('fast-check').Arbitrary<Decoder.OutputOf<D>>,
  ) {
    super()
  }
}

export const arbitrary =
  <O1, O2 extends O1>(
    arbitrary: (fc: typeof import('fast-check')) => import('fast-check').Arbitrary<O2>,
  ) =>
  <
    DI,
    DE,
    C extends AnyConstructor,
    E extends AnyEncoder,
    J extends JsonSchema<any>,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
  >(
    schema: Schema<Decoder.Decoder<DI, DE, O1>, C, E, J, Api, Annotations>,
  ): Schema<Decoder.Decoder<DI, DE, O1>, C, E, J, Api, Annotations> =>
    new ArbitrarySchema(schema, arbitrary)
