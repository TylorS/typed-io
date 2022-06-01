import type { ReadonlyRecord } from 'hkt-ts/Record'
import type { U } from 'ts-toolbelt'

import type { PropertySchema } from './prop'
import type { UnionAnnotations } from './union'

import { Lens, fromProp } from '@/Optics/Lens/Lens'
import {
  ConstructorErrorOf,
  ConstructorInputOf,
  DecodedOf,
  DecoderErrorOf,
  DecoderInputOf,
  EncodedOf,
  Schema,
} from '@/Schema'

export const fromStruct = <Props extends ReadonlyRecord<string, PropertySchema<any, any>>>(
  props: Props,
): Schema<
  [
    {
      readonly [K in OptionalKeys<Props>]?: DecoderInputOf<Props[K]>
    } & {
      readonly [K in RequiredKeys<Props>]: DecoderInputOf<Props[K]>
    },
  ] extends [infer R]
    ? { readonly [K in keyof R]: R[K] }
    : never,
  DecoderErrorOf<Props[string]>,
  [
    {
      readonly [K in OptionalKeys<Props>]?: DecodedOf<Props[K]>
    } & {
      readonly [K in RequiredKeys<Props>]: DecodedOf<Props[K]>
    },
  ] extends [infer R]
    ? { readonly [K in keyof R]: R[K] }
    : never,
  [
    {
      readonly [K in OptionalKeys<Props>]?: ConstructorInputOf<Props[K]>
    } & {
      readonly [K in RequiredKeys<Props>]: ConstructorInputOf<Props[K]>
    },
  ] extends [infer R]
    ? { readonly [K in keyof R]: R[K] }
    : never,
  ConstructorErrorOf<Props[string]>,
  [
    {
      readonly [K in OptionalKeys<Props>]?: EncodedOf<Props[K]>
    } & {
      readonly [K in RequiredKeys<Props>]: EncodedOf<Props[K]>
    },
  ] extends [infer R]
    ? { readonly [K in keyof R]: R[K] }
    : never,
  {
    readonly props: Props
    readonly lens: <K extends keyof Props>(
      key: K,
    ) => Lens<{ readonly [K in keyof Props]: DecodedOf<Props[K]> }, DecodedOf<Props[K]>>
  },
  UnionAnnotations<U.ListOf<Props[keyof Props]>>
> => new FromStructSchema(props)

export class FromStructSchema<
  Props extends ReadonlyRecord<string, PropertySchema<any, any>>,
> extends Schema<
  [
    {
      readonly [K in OptionalKeys<Props>]?: DecoderInputOf<Props[K]>
    } & {
      readonly [K in RequiredKeys<Props>]: DecoderInputOf<Props[K]>
    },
  ] extends [infer R]
    ? { readonly [K in keyof R]: R[K] }
    : never,
  DecoderErrorOf<Props[string]>,
  [
    {
      readonly [K in OptionalKeys<Props>]?: DecodedOf<Props[K]>
    } & {
      readonly [K in RequiredKeys<Props>]: DecodedOf<Props[K]>
    },
  ] extends [infer R]
    ? { readonly [K in keyof R]: R[K] }
    : never,
  [
    {
      readonly [K in OptionalKeys<Props>]?: ConstructorInputOf<Props[K]>
    } & {
      readonly [K in RequiredKeys<Props>]: ConstructorInputOf<Props[K]>
    },
  ] extends [infer R]
    ? { readonly [K in keyof R]: R[K] }
    : never,
  ConstructorErrorOf<Props[string]>,
  [
    {
      readonly [K in OptionalKeys<Props>]?: EncodedOf<Props[K]>
    } & {
      readonly [K in RequiredKeys<Props>]: EncodedOf<Props[K]>
    },
  ] extends [infer R]
    ? { readonly [K in keyof R]: R[K] }
    : never,
  {
    readonly props: Props
    readonly lens: <K extends keyof Props>(
      key: K,
    ) => Lens<{ readonly [K in keyof Props]: DecodedOf<Props[K]> }, DecodedOf<Props[K]>>
  },
  UnionAnnotations<U.ListOf<Props[keyof Props]>>
> {
  static type = 'Struct'
  readonly type = FromStructSchema.type

  constructor(readonly properties: Props) {
    super()
  }

  get api() {
    return {
      props: this.properties,
      lens: fromProp<{ readonly [K in keyof Props]: DecodedOf<Props[K]> }>(),
    }
  }
}

export type OptionalKeys<Props extends ReadonlyRecord<string, PropertySchema<any, any>>> = {
  readonly [K in keyof Props]: Props[K]['isOptional'] extends true ? K : never
}[keyof Props]

export type RequiredKeys<Props extends ReadonlyRecord<string, PropertySchema<any, any>>> = {
  readonly [K in keyof Props]: Props[K]['isOptional'] extends false ? K : never
}[keyof Props]
