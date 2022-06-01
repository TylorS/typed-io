import {
  AnnotationsOf,
  AnySchema,
  ApiOf,
  ConstructorErrorOf,
  ConstructorInputOf,
  DecodedOf,
  DecoderErrorOf,
  DecoderInputOf,
  EncodedOf,
  Schema,
} from '@/Schema'

export function lazy<S extends AnySchema>(
  f: () => S,
): Schema<
  DecoderInputOf<S>,
  DecoderErrorOf<S>,
  DecodedOf<S>,
  ConstructorInputOf<S>,
  ConstructorErrorOf<S>,
  EncodedOf<S>,
  ApiOf<S>,
  AnnotationsOf<S>
> {
  return new LazySchema(f)
}

export class LazySchema<S extends AnySchema> extends Schema<
  DecoderInputOf<S>,
  DecoderErrorOf<S>,
  DecodedOf<S>,
  ConstructorInputOf<S>,
  ConstructorErrorOf<S>,
  EncodedOf<S>,
  ApiOf<S>,
  AnnotationsOf<S>
> {
  static type = 'Lazy'
  readonly type = LazySchema.type
  protected memoed: S | null = null

  constructor(readonly f: () => S) {
    super()
  }

  protected memoized(): S {
    if (!this.memoed) {
      this.memoed = this.f()
    }

    return this.memoed
  }

  get api() {
    return this.memoized().api
  }
}
