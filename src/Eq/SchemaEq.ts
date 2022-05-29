import { AnyAnnotation } from '@/Annotation/Annotation'
import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class SchemaEq<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations extends ReadonlyArray<any>,
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
  static type = 'Eq'
  readonly type = SchemaEq.type;
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
    readonly equals: (a: Decoded, b: Decoded) => boolean,
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}

export const equals =
  <Decoded>(equals: (a: Decoded, b: Decoded) => boolean) =>
  <
    DecodeInput,
    DecodeError,
    ConstructorInput,
    ConstructorError,
    Encoded,
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
    new SchemaEq(schema, equals)
