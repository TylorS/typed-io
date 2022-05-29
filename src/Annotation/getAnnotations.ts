import { AnyAnnotation } from './Annotation'
import { getAnnotations_ } from './getAnnotations_'

import { AnnotationsOf, AnySchema, ContinuationSymbol, hasContinuation } from '@/Schema'

export function getAnnotations<S extends AnySchema>(schema: S): AnnotationsOf<S> {
  const annotations: Array<AnyAnnotation> = [...getAnnotations_(schema)]
  let current = hasContinuation(schema) ? schema[ContinuationSymbol] : null

  while (current) {
    annotations.unshift(...getAnnotations_(current))
    current = hasContinuation(current) ? current[ContinuationSymbol] : null
  }

  return annotations as AnnotationsOf<S>
}
