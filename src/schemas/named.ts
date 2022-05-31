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
import { single } from '@/SchemaError/SchemaError'

export class NamedError<Name extends string, E> extends single('Named')<E> {
  constructor(readonly name: Name, error: E) {
    super(error)
  }
}

export class SchemaNamed<Name extends string, S extends AnySchema> extends Schema<
  DecoderInputOf<S>,
  NamedError<Name, DecoderErrorOf<S>>,
  DecodedOf<S>,
  ConstructorInputOf<S>,
  NamedError<Name, ConstructorErrorOf<S>>,
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
    NamedError<Name, DecoderErrorOf<S>>,
    DecodedOf<S>,
    ConstructorInputOf<S>,
    NamedError<Name, ConstructorErrorOf<S>>,
    EncodedOf<S>,
    ApiOf<S>,
    AnnotationsOf<S>
  > =>
    new SchemaNamed(name, schema)
