import { ReadonlyRecord } from 'hkt-ts/Record'
import { Integer } from 'hkt-ts/number'
import { Equals } from 'ts-toolbelt/out/Any/Equals'

import { JsonSchema } from './JsonSchema'
import { IntegerConstraints } from './integer'
import { ToIntersection } from './intersection'
import { NumberConstraints } from './number'
import { StringConstraints } from './string'

import { GetSharedType } from '@/Constraints/shared'
import { GetTypeFromStringConstraints } from '@/Constraints/string'
import { StructAdditionalProperties } from '@/Constraints/struct'

export type StringBaseSchema = { readonly type: 'string' }
export type NumberBaseSchema = { readonly type: 'number' }
export type IntegerBaseSchema = { readonly type: 'integer' }
export type NullBaseSchema = { readonly type: 'null' }
export type ArrayBaseSchema = { readonly type: 'array' }
export type ObjectBaseSchema = { readonly type: 'object' }
export type AllOfBaseScheam = { readonly allOf: ReadonlyArray<any> }
export type AnyOfBaseScheam = { readonly anyOf: ReadonlyArray<any> }
export type OneOfBaseScheam = { readonly oneOf: ReadonlyArray<any> }

export type UnknownToNever<T> = Equals<T, unknown> extends 1 ? never : T

export type FromJsonSchema<S> = S extends JsonSchema<infer R>
  ? R
  : S extends boolean
  ? S
  : {
      readonly String: S extends StringConstraints<infer Const, infer Enum, infer Format>
        ? GetTypeFromStringConstraints<
            UnknownToNever<Const>,
            UnknownToNever<Enum>,
            UnknownToNever<Format>
          >
        : string
      readonly Number: S extends NumberConstraints<infer Const, infer Enum, infer Default>
        ? GetSharedType<UnknownToNever<Const>, UnknownToNever<Enum>, number | Default>
        : number
      readonly Integer: S extends IntegerConstraints<infer Const, infer Enum, infer Default>
        ? GetSharedType<UnknownToNever<Const>, UnknownToNever<Enum>, Integer | Default>
        : Integer
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
        ? [ToIntersection<{ readonly [K in keyof R]: FromJsonSchema<R[K]> }>] extends [infer T]
          ? { readonly [K in keyof T]: T[K] }
          : unknown
        : unknown
      readonly AnyOf: S extends { readonly anyOf: readonly [...infer R] }
        ? { readonly [K in keyof R]: FromJsonSchema<R[K]> }[number]
        : unknown
      readonly OneOf: S extends { readonly oneOf: readonly [...infer R] }
        ? { readonly [K in keyof R]: FromJsonSchema<R[K]> }[number]
        : unknown
    }[S extends StringBaseSchema
      ? 'String'
      : S extends NumberBaseSchema
      ? 'Number'
      : S extends IntegerBaseSchema
      ? 'Integer'
      : S extends NullBaseSchema
      ? 'Null'
      : S extends ArrayBaseSchema
      ? 'Array'
      : S extends ObjectBaseSchema
      ? 'Object'
      : S extends AllOfBaseScheam
      ? 'AllOf'
      : S extends AnyOfBaseScheam
      ? 'AnyOf'
      : S extends OneOfBaseScheam
      ? 'OneOf'
      : never]

export type FromJsonSchemaObject<T extends ObjectBaseSchema> = T extends {
  readonly properties: infer Props
  readonly required: readonly [...infer Required]
  readonly additionalProperties: infer Additional
}
  ? ([
      {
        readonly [K in keyof Props as K extends Required[number] ? K : never]: FromJsonSchema<
          Props[K]
        >
      } & {
        readonly [K in keyof Props as K extends Required[number] ? never : K]?: FromJsonSchema<
          Props[K]
        >
      },
    ] extends [infer T]
      ? { readonly [K in keyof T]: T[K] }
      : unknown) &
      StructAdditionalProperties<Additional>
  : T extends {
      readonly properties: infer Props
      readonly required: readonly [...infer Required]
    }
  ? [
      {
        readonly [K in keyof Props as K extends Required[number] ? K : never]: FromJsonSchema<
          Props[K]
        >
      } & {
        readonly [K in keyof Props as K extends Required[number] ? never : K]?: FromJsonSchema<
          Props[K]
        >
      },
    ] extends [infer T]
    ? { readonly [K in keyof T]: T[K] }
    : unknown
  : T extends {
      readonly properties: infer Props
    }
  ? {
      readonly [K in keyof Props]?: FromJsonSchema<Props[K]>
    }
  : ReadonlyRecord<string, unknown>
