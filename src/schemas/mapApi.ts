import {
  AnyAnnotations,
  AnyCapabilities,
  ContinuationSymbol,
  HasContinuation,
  Schema,
} from '@/Schema'

export class MapApiSchema<C extends AnyCapabilities, Api1, Annotations extends AnyAnnotations, Api2>
  extends Schema<C, Api2, Annotations>
  implements HasContinuation
{
  static type = '@typed/io/MapApiSchema'
  readonly type = MapApiSchema.type

  get api() {
    const { f, schema } = this

    return f(schema.api)
  }

  readonly [ContinuationSymbol] = this.schema

  constructor(readonly schema: Schema<C, Api1, Annotations>, readonly f: (a: Api1) => Api2) {
    super()
  }
}

export function mapApi<Api1, Api2>(f: (a: Api1) => Api2) {
  return <C extends AnyCapabilities, Annotations extends AnyAnnotations>(
    schema: Schema<C, Api1, Annotations>,
  ): Schema<C, Api2, Annotations> => new MapApiSchema(schema, f)
}
