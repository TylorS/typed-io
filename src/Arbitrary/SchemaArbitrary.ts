import { Arbitrary } from 'hkt-ts/Law/Arbitrary'

import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class SchemaArbitrary<
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
  static type = 'Arbitrary'
  readonly type = SchemaArbitrary.type;
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
    readonly arbitary: Arbitrary<Decoded>,
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}

export function arbitrary<Decoded>(arbitrary: Arbitrary<Decoded>) {
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
  > => new SchemaArbitrary(schema, arbitrary)
}
