import {
  AnnotationsOf,
  AnySchema,
  ApiOf,
  ConstructorErrorOf,
  ConstructorInputOf,
  DecodedOf,
  DecoderErrorOf,
  DecoderInputOf,
  EncodedOf,
  Schema,
} from '@/Schema'

export class PropertySchema<S extends AnySchema, Optional extends boolean> extends Schema<
  DecoderInputOf<S>,
  DecoderErrorOf<S>,
  DecodedOf<S>,
  ConstructorInputOf<S>,
  ConstructorErrorOf<S>,
  EncodedOf<S>,
  ApiOf<S>,
  AnnotationsOf<S>
> {
  static type = 'Property'
  readonly type = PropertySchema.type

  constructor(readonly schema: S, readonly isOptional: Optional) {
    super()
  }

  get api() {
    return this.schema.api
  }

  readonly optional = () => new PropertySchema(this.schema, true)
  readonly required = () => new PropertySchema(this.schema, false)
}

export const prop = <S extends AnySchema>(schema: S) => new PropertySchema(schema, false)
