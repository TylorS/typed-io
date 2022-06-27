import { Branded, Combine } from 'hkt-ts/Branded'

import { Guard } from './Guard'

export const intersection = <A extends ReadonlyArray<any>>(
  ...guards: { readonly [K in keyof A]: Guard<A[K]> }
): Guard<ToIntersection<A>> => Guard((i): i is ToIntersection<A> => guards.every((g) => g.is(i)))

type ToIntersection<T extends ReadonlyArray<any>, R = unknown> = T extends readonly [
  infer Head,
  ...infer Tail,
]
  ? ToIntersection<Tail, CombineRefinement<R, Head>>
  : { readonly [K in keyof R]: R[K] }

export const and =
  <B>(right: Guard<B>) =>
  <A>(left: Guard<A>): Guard<CombineRefinement<A, B>> =>
    intersection(left, right) as Guard<CombineRefinement<A, B>>

type CombineRefinement<A, B> = A extends Branded<any, any>
  ? B extends Branded<any, any>
    ? Combine<A, B>
    : A & B
  : A & B
