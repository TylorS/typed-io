import { NonEmptyArray } from 'hkt-ts/NonEmptyArray'
import { ReadonlyRecord } from 'hkt-ts/Record'
import { Integer } from 'hkt-ts/number'
import { Cast } from 'ts-toolbelt/out/Any/Cast'
import { Equals } from 'ts-toolbelt/out/Any/Equals'

import { JsonSchema, unknown } from './JsonSchema'
import { ToIntersection } from './intersection'

import { GetSharedType } from '@/Constraints/shared'
import { GetTypeFromStringConstraints, StringFormat } from '@/Constraints/string'
import { StructAdditionalProperties } from '@/Constraints/struct'

export type BooleanBaseSchema = { readonly type: 'boolean' }
export type StringBaseSchema = { readonly type: 'string' }
export type NumberBaseSchema = { readonly type: 'number' }
export type IntegerBaseSchema = { readonly type: 'integer' }
export type NullBaseSchema = { readonly type: 'null' }
export type ArrayBaseSchema = { readonly type: 'array' }
export type ObjectBaseSchema = { readonly type: 'object' }
export type AllOfBaseScheam = { readonly allOf: NonEmptyArray<any> }
export type AnyOfBaseScheam = { readonly anyOf: NonEmptyArray<any> }
export type OneOfBaseScheam = { readonly oneOf: NonEmptyArray<any> }

export type UnknownToNever<T> = Equals<T, unknown> extends 1 ? never : T

export interface FromJsonSchemaMap<S> {
  readonly Boolean: GetSharedType<ExtractConst<S>, ExtractEnum<S>, boolean | ExtractDefault<S>>
  readonly String: GetSharedType<ExtractConst<S>, ExtractEnum<S>, string | ExtractDefault<S>>
  readonly Number: GetSharedType<ExtractConst<S>, ExtractEnum<S>, number | ExtractDefault<S>>
  readonly Integer: GetSharedType<ExtractConst<S>, ExtractEnum<S>, Integer | ExtractDefault<S>>
  readonly Null: null
  readonly Array: S extends { readonly contains: infer R }
    ? ReadonlyArray<FromJsonSchema<R>>
    : S extends { readonly items: infer R }
    ? { readonly [K in keyof R]: FromJsonSchema<R[K]> }
    : readonly unknown[]
  readonly Object: S extends ObjectBaseSchema
    ? FromJsonSchemaObject<S>
    : ReadonlyRecord<string, unknown>
  readonly AllOf: S extends { readonly allOf: readonly [...infer R] }
    ? ToIntersection<{ readonly [K in keyof R]: FromJsonSchema<R[K]> }>
    : unknown
  readonly AnyOf: S extends { readonly anyOf: readonly [...infer R] }
    ? { readonly [K in keyof R]: FromJsonSchema<R[K]> }[number]
    : unknown
  readonly OneOf: S extends { readonly oneOf: readonly [...infer R] }
    ? { readonly [K in keyof R]: FromJsonSchema<R[K]> }[number]
    : unknown
}

export type ExtractConst<T> = 'const' extends keyof T ? T['const'] : never
export type ExtractEnum<T> = 'enum' extends keyof T ? T['enum'] : never
export type ExtractFormat<T> = 'format' extends keyof T ? T['format'] : never
export type ExtractDefault<T> = 'default' extends keyof T ? T['default'] : never
export type ExtractAllOf<T> = 'allOf' extends keyof T ? T['allOf'] : never

export type FromJsonSchema<S> = S extends JsonSchema<infer R>
  ? R
  : S extends boolean
  ? S
  : GetKeys<S> extends readonly []
  ? unknown
  : GetKeys<S> extends readonly [infer Head extends keyof FromJsonSchemaMap<S>]
  ? FromJsonSchemaMap<S>[Head]
  : GetKeys<S> extends readonly ['Object', ...infer Tail]
  ? FoldKeysAnd<S, readonly ['Object', ...Tail]>
  : FoldKeysOr<S, GetKeys<S>>

export type FoldKeysAnd<S, Keys extends ReadonlyArray<any>, R = unknown> = Keys extends readonly [
  infer Head extends keyof FromJsonSchemaMap<S>,
  ...infer Tail,
]
  ? FoldKeysAnd<S, Tail, R & FromJsonSchemaMap<S>[Head]>
  : { readonly [K in keyof R]: R[K] }

export type FoldKeysOr<S, Keys extends ReadonlyArray<any>, R = never> = Keys extends readonly [
  infer Head extends keyof FromJsonSchemaMap<S>,
  ...infer Tail,
]
  ? FoldKeysOr<S, Tail, R | FromJsonSchemaMap<S>[Head]>
  : R

export type GetKeys<S> = readonly [
  ...(S extends ObjectBaseSchema ? ['Object'] : []),
  ...(S extends BooleanBaseSchema ? ['Boolean'] : []),
  ...(S extends StringBaseSchema ? ['String'] : []),
  ...(S extends NumberBaseSchema ? ['Number'] : []),
  ...(S extends IntegerBaseSchema ? ['Integer'] : []),
  ...(S extends NullBaseSchema ? ['Null'] : []),
  ...(S extends ArrayBaseSchema ? ['Array'] : []),
  ...(S extends AllOfBaseScheam ? ['AllOf'] : []),
  ...(S extends AnyOfBaseScheam ? ['AnyOf'] : []),
  ...(S extends OneOfBaseScheam ? ['OneOf'] : []),
]

export type FromJsonSchemaObject<T extends ObjectBaseSchema> = BuildJsonSchemaObject<
  ExtractProperties<T>,
  ExtractRequired<T>[number],
  ExtractAdditionalProperties<T>
>

export type ExtractProperties<T> = 'properties' extends keyof T ? T['properties'] : never

export type ExtractRequired<T> = 'required' extends keyof T
  ? T['required'] extends ReadonlyArray<string>
    ? T['required']
    : never
  : never

export type ExtractAdditionalProperties<T> = 'additionalProperties' extends keyof T
  ? T['additionalProperties']
  : never

export type BuildJsonSchemaObject<Props, RequiredKeys extends string, Additional> = Equals<
  never,
  Props
> extends 1
  ? ReadonlyRecord<string, unknown>
  : {
      readonly [K in keyof Props as K extends RequiredKeys ? K : never]: FromJsonSchema<Props[K]>
    } & {
      readonly [K in keyof Props as K extends RequiredKeys ? never : K]?: FromJsonSchema<Props[K]>
    } & (Equals<never, Additional> extends 1
        ? unknown
        : StructAdditionalProperties<FromJsonSchema<Additional>>)
