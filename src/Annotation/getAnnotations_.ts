import { AnySchema } from '@/Schema'
import { SchemaAnnotations } from '@/schemas/core/annotations'

export function getAnnotations_<S extends AnySchema>(schema: S) {
  if (schema.type === SchemaAnnotations.type) {
    return (schema as any as SchemaAnnotations<any, any, any, any>).annotations
  }

  return []
}
