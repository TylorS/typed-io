import { JsonSchema } from './JsonSchema'
import * as J from './JsonSchema'

import { AnyAnnotation } from '@/Annotation/Annotation'
import { Schema } from '@/Schema'

export class SchemaJsonSchema<
  DecodeInput,
  DecodeError,
  Decoded,
  ConstructorInput,
  ConstructorError,
  Encoded,
  Api,
  Annotations extends ReadonlyArray<AnyAnnotation>,
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
  static type = 'JsonSchema'
  readonly type = SchemaJsonSchema.type

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
    readonly jsonSchema: JsonSchema<Encoded>,
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}

export const jsonSchema =
  <Encoded>(make: (j: typeof J) => JsonSchema<Encoded>) =>
  <
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
  > =>
    new SchemaJsonSchema(schema, make(J))
