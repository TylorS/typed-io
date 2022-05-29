import { Annotation } from './Annotation'
import { getAnnotations_ } from './getAnnotations_'

import { AnnotationsOf, AnySchema, ContinuationSymbol, hasContinuation } from '@/Schema'

export function getAnnotation<Id>(id: Id) {
  return function getAnnotation_<S extends AnySchema>(
    schema: S,
  ): FindAnnotation<Id, AnnotationsOf<S>> {
    let current: AnySchema | null = schema

    while (current) {
      for (const annotation of getAnnotations_(current)) {
        if (annotation.id === id) {
          return annotation.value
        }
      }

      current = hasContinuation(current) ? current[ContinuationSymbol] : null
    }

    throw new Error(`Unable to find Annotation by ID: ${id}`)
  }
}

export type FindAnnotation<Id, S extends ReadonlyArray<any>> = S extends readonly [
  infer Head,
  ...infer Tail,
]
  ? Head extends Annotation<Id, infer R>
    ? R
    : FindAnnotation<Id, Tail>
  : never
