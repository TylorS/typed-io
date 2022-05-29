import { Refinement } from 'hkt-ts/Refinement'

import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class SchemaRefine<
    DecodeInput,
    DecodeError,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations extends ReadonlyArray<any>,
    A,
    B extends A,
  >
  extends Schema<
    DecodeInput,
    DecodeError,
    B,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations
  >
  implements HasContinuation
{
  static type = 'Refine'
  readonly type = SchemaRefine.type;
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
    readonly refinement: Refinement<A, B>,
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}

export function refine<A, B extends A>(refinement: Refinement<A, B>) {
  return <
    DecodeInput,
    DecodeError,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations extends ReadonlyArray<any>,
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
  ): Schema<
    DecodeInput,
    DecodeError,
    B,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations
  > => new SchemaRefine(schema, refinement)
}
