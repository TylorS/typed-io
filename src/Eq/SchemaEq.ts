import { Schema } from '@/Schema'

export class SchemaEq<
  DecodeInput,
  DecodeError,
  Decoded,
  ConstructorInput,
  ConstructorError,
  Encoded,
  Api,
  Annotations extends ReadonlyArray<any>,
> extends Schema<
  DecodeInput,
  DecodeError,
  Decoded,
  ConstructorInput,
  ConstructorError,
  Encoded,
  Api,
  Annotations
> {
  static type = 'Eq'
  readonly type = SchemaEq.type

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
    readonly equals: (a: Decoded, b: Decoded) => boolean,
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}
