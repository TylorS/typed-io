import { Decoder } from './Decoder'

import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class SchemaDecoder<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations extends ReadonlyArray<any>,
    I,
    E,
  >
  extends Schema<I, E, Decoded, ConstructorInput, ConstructorError, Encoded, Api, Annotations>
  implements HasContinuation
{
  static type = 'Decoder'
  readonly type = SchemaDecoder.type;
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
    readonly decode: Decoder<I, E, Decoded>['decode'],
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}

export const decode =
  <I, E, O>(decode: Decoder<I, E, O>['decode']) =>
  <
    DecodeInput,
    DecodeError,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations extends ReadonlyArray<any>,
  >(
    schema: Schema<
      DecodeInput,
      DecodeError,
      O,
      ConstructorInput,
      ConstructorError,
      Encoded,
      Api,
      Annotations
    >,
  ): Schema<I, E, O, ConstructorInput, ConstructorError, Encoded, Api, Annotations> =>
    new SchemaDecoder(schema, decode)
