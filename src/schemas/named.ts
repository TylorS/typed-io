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

export class SchemaNamed<Name extends string, S extends AnySchema> extends Schema<
  DecoderInputOf<S>,
  DecoderErrorOf<S>,
  DecodedOf<S>,
  ConstructorInputOf<S>,
  ConstructorErrorOf<S>,
  EncodedOf<S>,
  ApiOf<S>,
  AnnotationsOf<S>
> {
  static type = 'Named'
  readonly type = SchemaNamed.type

  constructor(readonly name: Name, readonly schema: S) {
    super()
  }

  get api() {
    return this.schema.api
  }
}

export const named =
  <Name extends string>(name: Name) =>
  <S extends AnySchema>(
    schema: S,
  ): Schema<
    DecoderInputOf<S>,
    DecoderErrorOf<S>,
    DecodedOf<S>,
    ConstructorInputOf<S>,
    ConstructorErrorOf<S>,
    EncodedOf<S>,
    ApiOf<S>,
    AnnotationsOf<S>
  > =>
    new SchemaNamed(name, schema)
