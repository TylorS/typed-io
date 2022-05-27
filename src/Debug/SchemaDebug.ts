import { Schema } from '@/Schema'

export class SchemaDebug<
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
  static type = 'Debug'
  readonly type = SchemaDebug.type

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
    readonly debug: (decoded: Decoded) => string,
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}
