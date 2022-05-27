import { AnyAnnotation } from '@/Annotation/Annotation'
import { Schema } from '@/Schema'

export class SchemaCompose<
  DecodeInput1,
  DecodeError1,
  Decoded1,
  ConstructorInput1,
  ConstructorError1,
  Encoded1,
  Api1,
  Annotations1 extends ReadonlyArray<AnyAnnotation>,
  DecodeError2,
  Decoded2,
  ConstructorInput2,
  ConstructorError2,
  Encoded2,
  Api2,
  Annotations2 extends ReadonlyArray<AnyAnnotation>,
> extends Schema<
  DecodeInput1,
  DecodeError1 | DecodeError2,
  Decoded2,
  ConstructorInput2,
  ConstructorError2,
  Encoded2,
  Api2,
  readonly [...Annotations1, ...Annotations2]
> {
  static type = 'Compose'
  readonly type = SchemaCompose.type

  constructor(
    readonly left: Schema<
      DecodeInput1,
      DecodeError1,
      Decoded1,
      ConstructorInput1,
      ConstructorError1,
      Encoded1,
      Api1,
      Annotations1
    >,
    readonly right: Schema<
      Decoded1,
      DecodeError2,
      Decoded2,
      ConstructorInput2,
      ConstructorError2,
      Encoded2,
      Api2,
      Annotations2
    >,
  ) {
    super()
  }

  get api() {
    return this.right.api
  }
}

export const compose =
  <
    Decoded1,
    DecodeError2,
    Decoded2,
    ConstructorInput2,
    ConstructorError2,
    Encoded2,
    Api2,
    Annotations2 extends ReadonlyArray<AnyAnnotation>,
  >(
    right: Schema<
      Decoded1,
      DecodeError2,
      Decoded2,
      ConstructorInput2,
      ConstructorError2,
      Encoded2,
      Api2,
      Annotations2
    >,
  ) =>
  <
    DecodeInput1,
    DecodeError1,
    ConstructorInput1,
    ConstructorError1,
    Encoded1,
    Api1,
    Annotations1 extends ReadonlyArray<AnyAnnotation>,
  >(
    left: Schema<
      DecodeInput1,
      DecodeError1,
      Decoded1,
      ConstructorInput1,
      ConstructorError1,
      Encoded1,
      Api1,
      Annotations1
    >,
  ): Schema<
    DecodeInput1,
    DecodeError1 | DecodeError2,
    Decoded2,
    ConstructorInput2,
    ConstructorError2,
    Encoded2,
    Api2,
    readonly [...Annotations1, ...Annotations2]
  > =>
    new SchemaCompose(left, right)
