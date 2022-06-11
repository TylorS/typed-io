import { AnyAnnotation } from '@/Annotation/Annotation'
import {
  AnyAnnotations,
  AnyCapabilities,
  ContinuationSymbol,
  HasContinuation,
  Schema,
} from '@/Schema'

export class SchemaAnnotations<
    C extends AnyCapabilities,
    Api,
    Annotations extends AnyAnnotations,
    AppendedAnnotations extends AnyAnnotations,
  >
  extends Schema<C, Api, readonly [...Annotations, ...AppendedAnnotations]>
  implements HasContinuation
{
  static type = '@typed/io/Annotations' as const
  readonly type = SchemaAnnotations.type

  get api() {
    return this.schema.api
  }

  readonly [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<C, Api, Annotations>,
    readonly annotations: AppendedAnnotations,
  ) {
    super()
  }
}

export const addAnnotations =
  <AppendedAnnotations extends AnyAnnotations>(annotations: AppendedAnnotations) =>
  <C extends AnyCapabilities, Api, Annotations extends AnyAnnotations>(
    schema: Schema<C, Api, Annotations>,
  ): Schema<C, Api, readonly [...Annotations, ...AppendedAnnotations]> =>
    new SchemaAnnotations(schema, annotations)

export const addAnnotation = <A extends AnyAnnotation>(annotation: A) =>
  addAnnotations([annotation] as const)
