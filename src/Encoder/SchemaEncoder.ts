import { Encoder } from './Encoder'

import { Schema } from '@/Schema'

export class SchemaEncoder<
  DecodeInput,
  DecodeError,
  Decoded,
  ConstructorInput,
  ConstructorError,
  Encoded,
  Api,
  Annotations extends ReadonlyArray<any>,
  Encoded2,
> extends Schema<
  DecodeInput,
  DecodeError,
  Decoded,
  ConstructorInput,
  ConstructorError,
  Encoded2,
  Api,
  Annotations
> {
  static type = 'Encoder'
  readonly type = SchemaEncoder.type

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
    readonly encode: Encoder<Decoded, Encoded2>['encode'],
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}

export const encoder =
  <I, O>(encode: Encoder<I, O>['encode']) =>
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
      I,
      ConstructorInput,
      ConstructorError,
      Encoded,
      Api,
      Annotations
    >,
  ): Schema<DecodeInput, DecodeError, I, ConstructorInput, ConstructorError, O, Api, Annotations> =>
    new SchemaEncoder(schema, encode)
