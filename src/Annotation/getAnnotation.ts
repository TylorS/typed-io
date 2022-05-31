import { Annotation, AnnotationId } from './Annotation'
import { getAnnotations_ } from './getAnnotations_'

import { AnnotationsOf, AnySchema, ContinuationSymbol, hasContinuation } from '@/Schema'

export function getAnnotation<Id extends AnnotationId<any, any>>(id: Id) {
  return <S extends AnySchema>(schema: S): FindAnnotation<Id, AnnotationsOf<S>> => {
    let current: AnySchema | null = schema

    while (current) {
      for (const annotation of getAnnotations_(current)) {
        if (annotation.id === id) {
          return annotation.value
        }
      }

      current = hasContinuation(current) ? current[ContinuationSymbol] : null
    }

    throw new Error(`Unable to find Annotation by ID: ${id.toString()}`)
  }
}

export type FindAnnotation<
  Id extends AnnotationId<any, any>,
  S extends ReadonlyArray<any>,
> = S extends readonly [infer Head, ...infer Tail]
  ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Head extends Annotation<infer _, infer R>
    ? R
    : FindAnnotation<Id, Tail>
  : never
