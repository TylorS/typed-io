import { HKT, Kind_, ParamOf, Params } from 'hkt-ts'
import { NonEmptyArray } from 'hkt-ts/NonEmptyArray'
import { ReadonlyRecord } from 'hkt-ts/Record'
import { Equals } from 'ts-toolbelt/out/Any/Equals'

import { ConstrainA, DefaultsOf, SharedConstraints } from './shared'

import { Property } from '@/Schema'

export interface StructConstraints<
  T extends HKT,
  Properties extends ReadonlyRecord<string, Property<Kind_<[T], DefaultsOf<T>>, boolean>>,
  Additional extends Kind_<[T], DefaultsOf<T>> = never,
  PatternProperties extends ReadonlyRecord<string, ConstrainA<T, string>> = never,
  Dependencies extends ReadonlyRecord<
    keyof Properties & string,
    | ConstrainA<T, BuildStruct<T, Properties>[keyof BuildStruct<T, Properties>]>
    | NonEmptyArray<keyof Properties & string>
  > = never,
> extends SharedConstraints<
    T,
    BuildStruct<T, Properties> & StructAdditionalProperties<Additional>
  > {
  readonly patternProperties?: PatternProperties // Cannot be used to determine shape of output because it requires the ability to run Regex at type-level.
  readonly dependencies?: Dependencies // TODO: Build type for creating unions
  readonly default?: BuildStruct<T, Properties> & StructAdditionalProperties<Additional>
}

export type BuildStruct<
  T extends HKT,
  A extends ReadonlyRecord<string, Property<Kind_<[T], DefaultsOf<T>>, boolean>>,
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
