import { JsonSchema } from './JsonSchema'

export const intersection = <A extends ReadonlyArray<any>>(
  ...schemas: { readonly [K in keyof A]: JsonSchema<A[K]> }
): JsonSchema<ToIntersection<A>> =>
  JsonSchema({
    allOf: schemas,
  })

export type ToIntersection<T extends ReadonlyArray<any>, R = unknown> = T extends readonly [
  infer Head,
  ...infer Tail,
]
  ? ToIntersection<Tail, R & Head>
  : R
