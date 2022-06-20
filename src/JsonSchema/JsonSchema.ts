import { Branded, HKT, Params } from 'hkt-ts'
import { ReadonlyRecord } from 'hkt-ts/Record'
import { unsafeCoerce } from 'hkt-ts/function'
import * as JS from 'json-schema'
import { BuiltIn } from 'ts-toolbelt/out/Misc/BuiltIn'

export type JsonSchema<A> = Branded.Branded<
  { readonly DecodedJsonSchema: A },
  ReadonlyDeep<JS.JSONSchema7>
>

export type JsonSchemaDefinition<A> = Branded.Branded<
  { readonly DecodedJsonSchema: A },
  ReadonlyDeep<JS.JSONSchema7> | boolean
>

export type DecodedOf<T> = T extends boolean ? T : [T] extends [JsonSchema<infer R>] ? R : never

/**
 * Construct a JsonSchema that's tagged with the decoded value and optionally an ID.
 */
export const JsonSchema = <A>(schema: ReadonlyDeep<JS.JSONSchema7>): JsonSchema<A> =>
  unsafeCoerce({ $schema: 'json-schema.org/draft-07/schema#', ...schema })

export interface JsonSchemaHKT extends HKT {
  readonly type: JsonSchema<this[Params.A]>
}

type ReadonlyDeep<O> = O extends BuiltIn
  ? O
  : O extends Array<infer R>
  ? ReadonlyArray<ReadonlyDeep<R>>
  : O extends Set<infer R>
  ? ReadonlySet<ReadonlyDeep<R>>
  : O extends Map<infer K, infer R>
  ? ReadonlyMap<ReadonlyDeep<K>, ReadonlyDeep<R>>
  : {
      +readonly [K in keyof O]: ReadonlyDeep<O[K]>
    }

/**
 * Add an ID to a given JsonSchema
 */
export const $id =
  <Id extends string>(id: Id) =>
  <A>(jsonSchema: JsonSchema<A>) =>
    JsonSchema<A>({ ...jsonSchema, $id: id })

/**
 * Creates a Reference to another JsonSchema's ID
 */
export const $ref =
  <A>() =>
  <Ref extends string>(id: Ref) =>
    JsonSchema<A>({ $ref: id })

/**
 * Create a Reference to another Schema
 */
export const refFrom = <A>(schema: JsonSchema<A>) => {
  if (!schema.$id) {
    throw new Error(
      `Unable to construct a Ref from Schema without $id: ${JSON.stringify(schema, null, 2)}`,
    )
  }

  return $ref<A>()(schema.$id)
}

/**
 * Create a Reference to a Schema defined within "$defs"
 */
export const defsRef =
  <A>() =>
  <Ref extends string>(id: Ref) =>
    $ref<A>()(`#/$defs/${id}`)

/**
 * Create a Reference
 */
export const self = <A>() => $ref<A>()('#')

/**
 * Add or change the comment associated with a Schema
 */
export const $comment =
  (comment: string) =>
  <A>(jsonSchema: JsonSchema<A>): JsonSchema<A> =>
    JsonSchema<A>({ ...jsonSchema, $comment: comment })

/**
 * Add or change the $defs of a Schema
 */
export const $defs =
  <Defs extends ReadonlyRecord<string, JsonSchema<any>>>(defs: Defs) =>
  <A>(schema: JsonSchema<A>) =>
    JsonSchema<A>({ ...schema, $defs: { ...schema?.$defs, ...defs } })

export const unknown = JsonSchema<unknown>({
  anyOf: [
    { type: 'array' },
    { type: 'boolean' },
    { type: 'integer' },
    { type: 'null' },
    { type: 'number' },
    { type: 'object' },
    { type: 'string' },
  ],
})

export const unknownRecord = JsonSchema<ReadonlyRecord<string, unknown>>({
  type: 'object',
})

export const unknownArray = JsonSchema<ReadonlyArray<unknown>>({
  type: 'array',
})
