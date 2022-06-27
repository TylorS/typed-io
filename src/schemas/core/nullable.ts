import {
  AnyAnnotations,
  AnyCapabilities,
  ContinuationSymbol,
  HasContinuation,
  Schema,
} from '@/Schema'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface NullableCapabilities<C extends AnyCapabilities> {}

export class NullableSchema<
    Capabilities extends AnyCapabilities,
    Api,
    Annotations extends AnyAnnotations,
  >
  extends Schema<NullableCapabilities<Capabilities>, Api, Annotations>
  implements HasContinuation
{
  static type = '@typed/io/Nullable' as const
  readonly type = NullableSchema.type

  get api(): Api {
    return this.schema.api
  }

  readonly [ContinuationSymbol] = this.schema

  constructor(readonly schema: Schema<Capabilities, Api, Annotations>) {
    super()
  }
}

export const nullable = <
  Capabilities extends AnyCapabilities,
  Api,
  Annotations extends AnyAnnotations,
>(
  schema: Schema<Capabilities, Api, Annotations>,
): Schema<NullableCapabilities<Capabilities>, Api, Annotations> => new NullableSchema(schema)
