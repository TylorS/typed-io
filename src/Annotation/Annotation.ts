export class Annotation<Id, A> {
  constructor(readonly id: Id, readonly value: A) {}

  static make = <Id, A>(id: Id, value: A) => new Annotation(id, value)
}

export type AnyAnnotation = Annotation<any, any>

export const make = Annotation.make
