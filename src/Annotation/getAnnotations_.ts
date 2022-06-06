import { AnyAnnotation } from './Annotation'

import { AnySchema, SchemaAnnotation } from '@/Schema'

export function getAnnotations_<S extends AnySchema>(schema: S) {
  if (schema.type === SchemaAnnotation.type) {
    return (
      schema as SchemaAnnotation<
        any,
        any,
        any,
        any,
        any,
        ReadonlyArray<AnyAnnotation>,
        ReadonlyArray<AnyAnnotation>
      >
    ).annotations
  }

  return []
}
