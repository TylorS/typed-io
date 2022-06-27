import { pipe } from 'hkt-ts'
import { ReadonlyRecord, mapWithIndex } from 'hkt-ts/Record'
import { U } from 'ts-toolbelt'
import { Equals } from 'ts-toolbelt/out/Any/Equals'

import { IdentitySchema } from './index'

import { SharedConstraints } from '@/Constraints/shared'
import { GuardOutputOf } from '@/Guard/GuardSchema'
import { AnySchema, ApiOf, Property, Schema, SchemaHKT, prop } from '@/Schema'
import { Compact } from '@/internal'
import { IntersectionSchema, intersection } from '@/schemas/core/intersection'
import { string } from '@/schemas/core/string'
import { struct } from '@/schemas/core/struct'
import { TupleAnnotations } from '@/schemas/core/tuple'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SumCapabilities<Tag extends string, Members extends AnySumMembers> {}

export interface SumApi<Tag extends string, Members extends AnySumMembers> {
  readonly members: Members
  readonly pick: SumApiPick<Tag, Members>
  readonly omit: SumApiOmit<Tag, Members>
}

export type SumApiMembers<Members extends AnySumMembers> = {
  readonly [K in keyof Members]: ApiOf<Members[K]>
}

export type SumApiPick<Tag extends string, Members extends AnySumMembers> = <
  T extends ReadonlyArray<keyof Members>,
>(
  ...tags: T
) => ReturnType<ReturnType<typeof sum<Tag, Pick<Members, T[number]>>>>

export type SumApiOmit<Tag extends string, Members extends AnySumMembers> = <
  T extends ReadonlyArray<keyof Members>,
>(
  ...tags: T
) => ReturnType<ReturnType<typeof sum<Tag, Omit<Members, T[number]>>>>

export class SumSchema<
  Tag extends string,
  Members extends TagMembers<Tag, AnySumMembers>,
> extends Schema<
  SumCapabilities<Tag, Members>,
  SumApi<Tag, Members>,
  TupleAnnotations<U.ListOf<Members[string]>>
> {
  static type = '@typed/io/Sum' as const
  readonly type = SumSchema.type

  get api(): SumApi<Tag, Members> {
    return {
      members: this.members,
      pick: <T extends ReadonlyArray<keyof Members>>(...tags: T) =>
        sum<Tag, Pick<Members, T[number]>>(
          this.tag,
          this.constraints,
        )(
          Object.fromEntries(
            Object.entries(this.members).flatMap(([k, s]) => (tags.includes(k) ? [[k, s]] : [])),
          ) as Pick<Members, T[number]>,
        ),
      omit: <T extends ReadonlyArray<keyof Members>>(...tags: T) =>
        sum<Tag, Omit<Members, T[number]>>(
          this.tag,
          this.constraints,
        )(
          Object.fromEntries(
            Object.entries(this.members).flatMap(([k, s]) => (tags.includes(k) ? [] : [[k, s]])),
          ) as Omit<Members, T[number]>,
        ),
    }
  }

  constructor(
    readonly tag: Tag,
    readonly members: Members,
    // TODO: How to better extract output values from Schemas?
    readonly constraints?: SharedConstraints<SchemaHKT, GuardOutputOf<Members[string]>>,
  ) {
    super()
  }
}

export const sum: <Tag extends string, Members extends AnySumMembers>(
  tag: Tag,
  constraints?: SharedConstraints<SchemaHKT, GuardOutputOf<Members[string]>>,
) => (members: Members) => {
  0: Schema<
    SumCapabilities<Tag, TagMembers<Tag, Members>>,
    SumApi<Tag, TagMembers<Tag, Members>>,
    TupleAnnotations<U.ListOf<TagMembers<Tag, Members>[string]>>
  >
  1: never
}[Equals<never, keyof Members>] = (tag, constraints) => (members) =>
  new SumSchema(
    tag,
    pipe(
      members,
      mapWithIndex((k, m) => intersection([m, struct({ [tag]: prop(string({ const: k })) })])),
    ) as any,
    constraints as any,
  ) as any

export type AnySumMembers = ReadonlyRecord<string, AnySchema>

export type TagMembers<Tag extends string, Members extends AnySumMembers> = {
  readonly [K in keyof Members]: [
    IntersectionSchema<
      [
        Members[K],
        ReturnType<
          typeof struct<{
            readonly [_ in Tag]: Property<IdentitySchema<K>, false>
          }>
        >,
      ]
    >,
  ] extends [Schema<infer C, infer Api, infer Annotations>]
    ? Schema<Compact<C>, Compact<Api>, Annotations>
    : never
}
