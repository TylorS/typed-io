import * as Constructor from './Constructor'

import { AnyAnnotation } from '@/Annotation/Annotation'
import * as Decoder from '@/Decoder/Decoder'
import { AnyEncoder } from '@/Encoder/Encoder'
import { JsonSchema } from '@/JsonSchema/JsonSchema'
import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class ConstructorSchema<
    D extends Decoder.AnyDecoder,
    C extends Constructor.AnyConstructor,
    E extends AnyEncoder,
    J extends JsonSchema<any>,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
    C2 extends Constructor.Constructor<any, any, Decoder.OutputOf<D>>,
  >
  extends Schema<D, C2, E, J, Api, Annotations>
  implements HasContinuation
{
  static type = 'Constructor'
  readonly type = ConstructorSchema.type

  get api() {
    return this.schema.api
  }

  readonly [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<D, C, E, J, Api, Annotations>,
    readonly construct: C2['construct'],
  ) {
    super()
  }
}

export const construct =
  <CI, CE, CO>(construct: Constructor.Constructor<CI, CE, CO>['construct']) =>
  <
    DI,
    DE,
    C extends Constructor.AnyConstructor,
    E extends AnyEncoder,
    J extends JsonSchema<any>,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
  >(
    schema: Schema<Decoder.Decoder<DI, DE, CO>, C, E, J, Api, Annotations>,
  ): Schema<
    Decoder.Decoder<DI, DE, CO>,
    Constructor.Constructor<CI, CE, CO>,
    E,
    J,
    Api,
    Annotations
  > =>
    new ConstructorSchema(schema, construct)
