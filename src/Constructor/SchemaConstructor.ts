import { Constructor } from './Constructor'

import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class SchemaConstructor<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations extends ReadonlyArray<any>,
    I,
    E,
  >
  extends Schema<DecodeInput, DecodeError, Decoded, I, E, Encoded, Api, Annotations>
  implements HasContinuation
{
  static type = 'Constructor'
  readonly type = SchemaConstructor.type;
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
    readonly construct: Constructor<I, E, Decoded>['construct'],
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}

export const constructor =
  <I, E, O>(construct: Constructor<I, E, O>['construct']) =>
  <
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
      O,
      ConstructorInput,
      ConstructorError,
      Encoded,
      Api,
      Annotations
    >,
  ): Schema<DecodeInput, DecodeError, O, I, E, Encoded, Api, Annotations> =>
    new SchemaConstructor(schema, construct)
