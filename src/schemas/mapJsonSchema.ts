import { AnyAnnotation } from '@/Annotation/Annotation'
import { JsonSchema } from '@/JsonSchema/index'
import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export function mapJsonSchema<Encoded>(f: (a: JsonSchema<Encoded>) => JsonSchema<Encoded>) {
  return <
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
  >(
    schema: Schema<
      DecodeInput,
      DecodeError,
      Decoded,
      ConstructorInput,
      ConstructorError,
      Encoded,
      Api,
      Annotations
    >,
  ): Schema<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations
  > => new SchemaMapJsonSchema(schema, f)
}

export class SchemaMapJsonSchema<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
  >
  extends Schema<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations
  >
  implements HasContinuation
{
  static type = 'MapJsonSchema'
  readonly type = SchemaMapJsonSchema.type;
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
    readonly f: (a: JsonSchema<Encoded>) => JsonSchema<Encoded>,
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}
