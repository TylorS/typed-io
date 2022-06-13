import { HKT, Kind_, ParamOf, Params } from 'hkt-ts'
import { NonEmptyArray } from 'hkt-ts/NonEmptyArray'
import { ReadonlyRecord } from 'hkt-ts/Record'
import { Equals } from 'ts-toolbelt/out/Any/Equals'

import { DefaultsOf, SharedConstraints } from './shared'

import { Property } from '@/Schema'

export interface StructConstraints<
  T extends HKT,
  A extends ReadonlyRecord<
    string,
    Property<
      Kind_<[T], DefaultsOf<T> extends readonly [...infer Init, any] ? [...Init, any] : [any]>,
      boolean
    >
  >,
  K extends string = keyof A & string,
  B = never,
> extends SharedConstraints<T, BuildStruct<T, A> & StructAdditionalProperties<B>> {
  readonly patternProperties?: ReadonlyRecord<
    string,
    Kind_<[T], DefaultsOf<T> extends readonly [...infer Init, any] ? [...Init, string] : [string]>
  >
  readonly propertyNames?:
    | Kind_<[T], DefaultsOf<T> extends readonly [...infer Init, any] ? [...Init, K] : [K]>
    | undefined
  readonly additionalProperties?:
    | Kind_<[T], DefaultsOf<T> extends readonly [...infer Init, any] ? [...Init, B] : [B]>
    | undefined
  readonly dependencies?: ReadonlyRecord<
    K,
    | Kind_<
        [T],
        DefaultsOf<T> extends readonly [...infer Init, any]
          ? [...Init, BuildStruct<T, A>[keyof BuildStruct<T, A>]]
          : [BuildStruct<T, A>[keyof BuildStruct<T, A>]]
      >
    | NonEmptyArray<K>
  >
  readonly default?: BuildStruct<T, A> & StructAdditionalProperties<B>
}

export type BuildStruct<
  T extends HKT,
  A extends ReadonlyRecord<
    string,
    Property<Kind_<[T], [any, any, any, any, any, any, any, any, any, any]>, boolean>
  >,
> = [
  {
    readonly [K in keyof A as A[K]['isOptional'] extends true ? K : never]?: ParamOf<
      T,
      A[K]['value'],
      Params.A
    >
  } & {
    readonly [K in keyof A as A[K]['isOptional'] extends false ? K : never]: ParamOf<
      T,
      A[K]['value'],
      Params.A
    >
  },
] extends [infer R]
  ? { readonly [K in keyof R]: R[K] }
  : never

export type StructAdditionalProperties<A> = {
  0: ReadonlyRecord<string, A>
  1: unknown
}[Equals<never, A>]
