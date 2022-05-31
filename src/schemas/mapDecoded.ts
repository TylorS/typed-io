import { AnyAnnotation } from '@/Annotation/Annotation'
import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export function mapDecoded<A, B>(f: (a: A) => B) {
  return <
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
      A,
      ConstructorInput,
      ConstructorError,
      Encoded,
      Api,
      Annotations
    >,
  ): Schema<DecodeInput, DecodeError, B, B, never, B, Api, Annotations> =>
    new SchemaMapDecoded(schema, f)
}

export class SchemaMapDecoded<
    DecodeInput,
    DecodeError,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
    A,
    B,
  >
  extends Schema<DecodeInput, DecodeError, B, B, never, B, Api, Annotations>
  implements HasContinuation
{
  static type = 'MapDecoded'
  readonly type = SchemaMapDecoded.type;
  readonly [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<
      DecodeInput,
      DecodeError,
      A,
      ConstructorInput,
      ConstructorError,
      Encoded,
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
