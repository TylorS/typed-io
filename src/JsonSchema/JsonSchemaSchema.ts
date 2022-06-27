import { JsonSchema } from './JsonSchema'

import {
  AnyAnnotations,
  AnyCapabilities,
  AnySchemaWith,
  ContinuationSymbol,
  HasContinuation,
  Schema,
} from '@/Schema'

export const JSON_SCHEMA = Symbol('@typed/io/JsonSchema')
export type JSON_SCHEMA = typeof JSON_SCHEMA

export type AnyJsonSchemaCapability = JsonSchemaCapability<any>

export type JsonSchemaOf<A> = A extends AnySchemaWith<infer R>
  ? JSON_SCHEMA extends keyof R
    ? R[JSON_SCHEMA]
    : never
  : never

export type JsonSchemaDecoded<T> = [JsonSchemaOf<T>] extends [JsonSchemaOf<infer R>] ? R : never

export interface JsonSchemaCapability<A> {
  readonly [JSON_SCHEMA]: JsonSchema<A>
}

export class JsonSchemaSchema<C extends AnyCapabilities, Api, Annotations extends AnyAnnotations, A>
  extends Schema<Omit<C, JSON_SCHEMA> & JsonSchemaCapability<A>, Api, Annotations>
  implements HasContinuation
{
  static type = '@typed/io/JsonSchema' as const
  readonly type = JsonSchemaSchema.type

  get api() {
    return this.schema.api
  }

  readonly [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<C, Api, Annotations>,
    readonly jsonSchema: (
      toJsonSchema: typeof import('./defaultInterpreter').toJsonSchema,
    ) => JsonSchema<A>,
  ) {
    super()
  }
}

export const jsonSchema =
  <A>(
    jsonSchema: (toJsonSchema: typeof import('./defaultInterpreter').toJsonSchema) => JsonSchema<A>,
  ) =>
  <C extends AnyCapabilities, Api, Annotations extends AnyAnnotations>(
    schema: Schema<C, Api, Annotations>,
  ): Schema<Omit<C, JSON_SCHEMA> & JsonSchemaCapability<A>, Api, Annotations> =>
    new JsonSchemaSchema(schema, jsonSchema)
