import type { HKT, Params } from 'hkt-ts'
import { Brand, BrandOf, Branded, Combine, ValueOf } from 'hkt-ts/Branded'
import { Data } from 'hkt-ts/Data'
import { Either } from 'hkt-ts/Either'
import { JsonPrimitive } from 'hkt-ts/Json'
import { Maybe } from 'hkt-ts/Maybe'
import { Progress } from 'hkt-ts/Progress'
import { ReadonlyRecord } from 'hkt-ts/Record'
import * as R from 'hkt-ts/Refinement'
import { RoseTree } from 'hkt-ts/RoseTree'
import { Tree } from 'hkt-ts/Tree'
import { flow, pipe, unsafeCoerce } from 'hkt-ts/function'
import * as N from 'hkt-ts/number'

import { ArrayConstraints, RecordConstraints, TupleConstraints } from '@/JsonSchema/JsonSchema'
import { Property, prop } from '@/Schema'
import { memoizeOnce } from '@/internal'
import * as Refinements from '@/refinements/index'

export interface Guard<A> {
  readonly is: R.Refinement<unknown, A>
}

export interface GuardHKT extends HKT {
  readonly type: Guard<this[Params.A]>
}

export type AnyGuard = Guard<any>

export function Guard<A>(is: Guard<A>['is']): Guard<A> {
  return {
    is,
  }
}

export const branded =
  <B extends Branded<any, any>>() =>
  (g: Guard<ValueOf<B>>): Guard<B> =>
    unsafeCoerce(g)

export const boolean = flow(Refinements.isBoolean, Guard)
export const number = flow(Refinements.isNumber, Guard)
export const integer = flow(Refinements.isInteger, Guard)
export const string = flow(Refinements.isString, Guard)

export const isNull = (x: unknown): x is null => x === null
export const isUndefined = (x: unknown): x is undefined => x === undefined
export const isVoid: R.Refinement<unknown, void> = isUndefined

export const union = <A extends ReadonlyArray<any>>(
  ...guards: { readonly [K in keyof A]: Guard<A[K]> }
): Guard<A[number]> => Guard((i): i is A[number] => guards.some((g) => g.is(i)))

export const intersection = <A extends ReadonlyArray<any>>(
  ...guards: { readonly [K in keyof A]: Guard<A[K]> }
): Guard<ToIntersection<A>> => Guard((i): i is ToIntersection<A> => guards.every((g) => g.is(i)))

type ToIntersection<T extends ReadonlyArray<any>, R = unknown> = T extends readonly [
  infer Head,
  ...infer Tail,
]
  ? ToIntersection<Tail, CombineRefinement<R, Head>>
  : { readonly [K in keyof R]: R[K] }

export const or =
  <B>(right: Guard<B>) =>
  <A>(left: Guard<A>): Guard<A | B> =>
    union(left, right)

export const and =
  <B>(right: Guard<B>) =>
  <A>(left: Guard<A>): Guard<CombineRefinement<A, B>> =>
    intersection(left, right) as Guard<CombineRefinement<A, B>>

type CombineRefinement<A, B> = A extends Branded<any, any>
  ? B extends Branded<any, any>
    ? Combine<A, B>
    : A & B
  : A & B

export const nullable = or(Guard(isNull))
export const optional = or(Guard(isUndefined))

const true_ = boolean({ const: true })
const false_ = boolean({ const: false })

export { true_ as true, false_ as false }

export const refine =
  <A, B extends A>(refinement: R.Refinement<A, B>) =>
  (guard: Guard<A>): Guard<ConcatRefinement<A, B>> =>
    pipe(guard.is, R.compose(refinement), Guard) as Guard<ConcatRefinement<A, B>>

type ConcatRefinement<T, U> = U extends Branded<any, any>
  ? ValueOf<U> & Brand<BrandOf<T> & BrandOf<U>>
  : U & Brand<BrandOf<T> & BrandOf<U>>

export const not =
  <A, B extends A>(refinement: R.Refinement<A, B>) =>
  (guard: Guard<A>): Guard<Exclude<A, B>> =>
    Guard(pipe(guard.is, R.compose(R.not(refinement))))

export const unknownArray = Guard<readonly unknown[]>(Array.isArray)

export const unknownRecord = Guard(Refinements.isUnknownRecord)

export const lazy = <A>(f: () => Guard<A>): Guard<A> => {
  const get = memoizeOnce(f)

  return {
    is: (u): u is A => get().is(u),
  }
}

export const array = <A>(guard: Guard<A>, constraints?: ArrayConstraints<A>): Guard<readonly A[]> =>
  Guard(Refinements.isArray(guard.is, constraints))

export const tuple = <A extends ReadonlyArray<A>>(
  guards: {
    readonly [K in keyof A]: Guard<A[K]>
  },
  constraints?: TupleConstraints<A>,
): Guard<A> => Guard(Refinements.isTuple(guards, constraints))

export const record = <A>(
  guard: Guard<A>,
  constraints?: RecordConstraints<string, A>,
): Guard<ReadonlyRecord<string, A>> => Guard(Refinements.isRecord(guard.is, constraints))

export const struct = <A extends Readonly<Record<PropertyKey, Property<AnyGuard, boolean>>>>(
  properties: A,
): Guard<BuildStruct<A>> =>
  pipe(
    unknownRecord,
    refine((u): u is BuildStruct<A> =>
      Object.entries(properties).every(([k, prop]) => {
        if (prop.isOptional && !(k in u)) {
          return true
        }

        return prop.value.is(u[k])
      }),
    ),
  )

export type BuildStruct<A> = [
  {
    readonly [K in keyof A as A[K] extends Property<any, true> ? K : never]?: A[K] extends Property<
      Guard<infer R>,
      boolean
    >
      ? R
      : never
  } & {
    readonly [K in keyof A as A[K] extends Property<any, false> ? K : never]: A[K] extends Property<
      Guard<infer R>,
      boolean
    >
      ? R
      : never
  },
] extends [infer R]
  ? { readonly [K in keyof R]: R[K] }
  : never

export const sum =
  <A extends ReadonlyRecord<string, any>>() =>
  <T extends keyof A>(tag: T) =>
  (guards: SumGuards<A, T>): Guard<A> =>
    pipe(
      unknownRecord,
      refine((u): u is A => tag in u && guards[u[tag] as keyof typeof guards].is(u)),
    )

export type SumGuards<T, Tag extends keyof T> = {
  readonly [K in T[Tag] & string]: Guard<FindSumGuard<T, Tag, K>>
}

export type FindSumGuard<T, Tag extends keyof T, K extends T[Tag]> = T extends {
  readonly [_ in Tag]: K
}
  ? T
  : never

export const literal = <A extends JsonPrimitive>(value: A): Guard<A> =>
  Guard((u): u is A => u === value)

export const oneOf = <A extends ReadonlyArray<JsonPrimitive>>(...values: A): Guard<A[number]> =>
  union(...values.map(literal))

export const maybe = <A>(value: Guard<A>): Guard<Maybe<A>> =>
  sum<Maybe<A>>()('tag')({
    Nothing: struct({
      tag: prop(literal('Nothing')),
    }),
    Just: struct({
      tag: prop(literal('Just')),
      value: prop(value),
    }),
  })

export const either = <E, A>(left: Guard<E>, right: Guard<A>): Guard<Either<E, A>> =>
  sum<Either<E, A>>()('tag')({
    Left: struct({
      tag: prop(literal('Left')),
      left: prop(left),
    }),
    Right: struct({
      tag: prop(literal('Right')),
      right: prop(right),
    }),
  })

export const progress: Guard<Progress> = struct({
  loaded: prop(branded<N.NonNegativeFloat>()(number())),
  total: prop(maybe(branded<N.NonNegativeFloat>()(number()))),
})

export const data = <A>(value: Guard<A>): Guard<Data<A>> =>
  sum<Data<A>>()('tag')({
    NoData: struct({
      tag: prop(literal('NoData')),
    }),
    Pending: struct({
      tag: prop(literal('Pending')),
      progress: prop(maybe(progress)),
    }),
    Refreshing: struct({
      tag: prop(literal('Refreshing')),
      progress: prop(maybe(progress)),
      value: prop(value),
    }),
    Replete: struct({
      tag: prop(literal('Replete')),
      value: prop(value),
    }),
  })

export const dataEither = flow(either, data)

export const tree = <P, C>(parent: Guard<P>, child: Guard<C>): Guard<Tree<P, C>> => {
  const guard = sum<Tree<P, C>>()('tag')({
    Parent: struct({
      tag: prop(literal('Parent')),
      value: prop(parent),
      forest: prop(array(lazy(() => guard))),
    }),
    Leaf: struct({
      tag: prop(literal('Leaf')),
      value: prop(child),
    }),
  })

  return guard
}

export const roseTree = <A>(value: Guard<A>): Guard<RoseTree<A>> => tree(value, value)
