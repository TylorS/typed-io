/* eslint-disable @typescript-eslint/no-unused-vars */
import { Branded } from 'hkt-ts/Branded'

export class Annotation<Id, A> {
  constructor(readonly id: AnnotationId<Id, A>, readonly value: A) {}

  static make = <Id, A>(id: AnnotationId<Id, A>, value: A) => new Annotation(id, value)
}

export type AnyAnnotation = Annotation<any, any>

export type AnnotationId<Id, A> = Branded<{ readonly AnnotationId: Id; readonly Value: A }, symbol>

export type ValueOf<T> = [T] extends [AnnotationId<infer R, infer _>]
  ? R
  : [T] extends [Annotation<infer _, infer R>]
  ? R
  : never

export type IdOf<T> = [T] extends [AnnotationId<infer _, infer R>]
  ? R
  : [T] extends [Annotation<infer R, infer _>]
  ? R
  : T

export const makeAnnotation =
  <A>() =>
  <Id extends string | symbol>(id: Id): AnnotationId<Id, A> =>
    Branded<AnnotationId<Id, A>>()(typeof id === 'symbol' ? id : Symbol(id))
