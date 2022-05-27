import { Constructor } from './Constructor'

import { Schema } from '@/Schema'

export class SchemaConstructor<
  DecodeInput,
  DecodeError,
  Decoded,
  ConstructorInput,
  ConstructorError,
  Encoded,
  Api,
  Annotations,
  I,
  E,
> extends Schema<DecodeInput, DecodeError, Decoded, I, E, Encoded, Api, Annotations> {
  static type = 'Constructor'
  readonly type = SchemaConstructor.type

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
  <DecodeInput, DecodeError, ConstructorInput, ConstructorError, Encoded, Api, Annotations>(
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
