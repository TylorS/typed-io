import { AnyAnnotation } from '@/Annotation/Annotation'
import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export function mapApi<A, B>(f: (a: A) => B) {
  return <
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Annotations extends ReadonlyArray<AnyAnnotation>,
  >(
    schema: Schema<
      DecodeInput,
      DecodeError,
      Decoded,
      ConstructorInput,
      ConstructorError,
      Encoded,
      A,
      Annotations
    >,
  ): Schema<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    B,
    Annotations
  > => new SchemaMapApi(schema, f)
}

export class SchemaMapApi<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
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
    Encoded,
    B,
    Annotations
  >
  implements HasContinuation
{
  static type = 'MapApi'
  readonly type = SchemaMapApi.type;
  readonly [ContinuationSymbol] = this.schema
  readonly api: B

  constructor(
    readonly schema: Schema<
      DecodeInput,
      DecodeError,
      Decoded,
      ConstructorInput,
      ConstructorError,
      Encoded,
      A,
      Annotations
    >,
    readonly f: (a: A) => B,
  ) {
    super()
    this.api = f(schema.api)
  }
}
