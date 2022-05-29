import { Annotation, AnyAnnotation } from './Annotation'

import { ContinuationSymbol, HasContinuation, Schema } from '@/Schema'

export class SchemaAnnotation<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    Annotations extends ReadonlyArray<AnyAnnotation>,
    Appended extends ReadonlyArray<AnyAnnotation>,
  >
  extends Schema<
    DecodeInput,
    DecodeError,
    Decoded,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api,
    readonly [...Annotations, ...Appended]
  >
  implements HasContinuation
{
  static type = 'Annotation'
  readonly type = SchemaAnnotation.type;
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
    readonly annotations: Appended,
  ) {
    super()
  }

  get api() {
    return this.schema.api
  }
}

export function addAnnotations<Appended extends ReadonlyArray<AnyAnnotation>>(
  annotations: Appended,
) {
  return <
    DecodeInput,
    DecodeError,
    Decoded,
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
  ) => new SchemaAnnotation(schema, annotations)
}

export function addAnnotation<Id, A>(annotation: Annotation<Id, A>) {
  return addAnnotations([annotation] as const)
}
