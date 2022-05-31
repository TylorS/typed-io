import { AnyAnnotation } from '@/Annotation/Annotation'
import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export function mapEncoded<A, B>(f: (a: A) => B) {
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
      A,
      Api,
      Annotations
    >,
  ): Schema<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    B,
    Api,
    Annotations
  > => new SchemaMapEncoded(schema, f)
}

export class SchemaMapEncoded<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
    A,
    B,
  >
  extends Schema<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    B,
    Api,
    Annotations
  >
  implements HasContinuation
{
  static type = 'MapEncoded'
  readonly type = SchemaMapEncoded.type;
  readonly [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<
      DecodeInput,
      DecodeError,
      Decoded,
      ConstructorInput,
      ConstructorError,
      A,
      Api,
      Annotations
    >,
    readonly f: (a: A) => B,
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}
