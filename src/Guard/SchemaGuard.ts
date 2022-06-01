import { Refinement } from 'hkt-ts/Refinement'

import { Guard } from './Guard'

import { AnyAnnotation } from '@/Annotation/Annotation'
import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class SchemaGuard<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
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
  static type = 'Guard'
  readonly type = SchemaGuard.type;
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
    readonly is: Refinement<unknown, Decoded>,
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}

export const guard =
  <O>(guard: Guard<O>['is']) =>
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
  ): Schema<
    DecodeInput,
    DecodeError,
    O,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations
  > =>
    new SchemaGuard(schema, guard)
