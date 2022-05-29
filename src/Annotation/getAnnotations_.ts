import { AnyAnnotation } from './Annotation'
import { SchemaAnnotation } from './SchemaAnnotation'

import { AnySchema } from '@/Schema'

export function getAnnotations_<S extends AnySchema>(schema: S) {
  if (schema.type === SchemaAnnotation.type) {
    return (
      schema as SchemaAnnotation<
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        ReadonlyArray<AnyAnnotation>
      >
    ).annotations
  }

  return []
}
