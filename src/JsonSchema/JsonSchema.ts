import * as Branded from 'hkt-ts/Branded'
import { Either, Left, Right } from 'hkt-ts/Either'
import { JsonPrimitive } from 'hkt-ts/Json'
import { Just, Maybe, Nothing } from 'hkt-ts/Maybe'
import { ReadonlyRecord } from 'hkt-ts/Record'
import { Both, These } from 'hkt-ts/These'
import { unsafeCoerce } from 'hkt-ts/function'
import { JSONSchema7 } from 'json-schema'

export type JsonSchema<A> = Branded.Branded<A, JSONSchema7>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ValueOf<T> = T extends Branded.Branded<infer Brand, infer _> ? Brand : unknown

export const JsonSchema = <A>(schema: JSONSchema7): JsonSchema<A> => unsafeCoerce(schema)

// Utilize a reference to another JsonSchema
export const ref =
  <A>() =>
  <Ref extends string>(id: Ref) =>
    JsonSchema<A>({ $ref: id })

export const self = <A>() => ref<A>()('#')

// Give your Schema a ID to be utilized by a ref
export const id =
  <Ref extends string>(id: Ref) =>
  <A>(schema: JsonSchema<A>) =>
    JsonSchema<A>({ ...schema, $id: id })

export const defs =
  <Defs extends ReadonlyRecord<string, JsonSchema<any>>>(defs: Defs) =>
  <A>(schema: JsonSchema<A>) =>
    JsonSchema<A>({ ...schema, definitions: { ...schema?.definitions, ...defs } })

export const string = JsonSchema<string>({ type: 'string' })
export const number = JsonSchema<number>({ type: 'number' })
export const boolean = JsonSchema<boolean>({ type: 'boolean' })
export const null_ = JsonSchema<null>({ type: 'null' })
export const date = JsonSchema<Date>({ type: 'string', format: 'date-time' })
export const unknownRecord: JsonSchema<ReadonlyRecord<string, unknown>> = JsonSchema({
  type: 'object',
})
export const unknownArray: JsonSchema<ReadonlyArray<unknown>> = JsonSchema({ type: 'array' })

export const exactly = <A extends JsonPrimitive>(value: A): JsonSchema<A> =>
  JsonSchema<A>({ enum: [value] })

export const union = <U extends ReadonlyArray<JsonSchema<any>>>(
  ...schemas: U
): JsonSchema<ValueOf<U[number]>> => JsonSchema<ValueOf<U[number]>>({ oneOf: [...schemas] })

export const nullable = <A>(schema: JsonSchema<A>): JsonSchema<A | null> => union(schema, null_)

export const oneOf = <A extends ReadonlyArray<JsonPrimitive>>(...values: A) =>
  JsonSchema<A>({ enum: [...values] })

export const array = <A>(schema: JsonSchema<A>): JsonSchema<ReadonlyArray<A>> =>
  JsonSchema<ReadonlyArray<A>>({ type: 'array', items: schema })

export const record = <A>(codomain: JsonSchema<A>): JsonSchema<ReadonlyRecord<string, A>> =>
  JsonSchema<ReadonlyRecord<string, A>>({ ...unknownRecord, additionalProperties: codomain })

export const partial = <A extends ReadonlyRecord<string, any>>(properties: {
  readonly [K in keyof A]: JsonSchema<A[K]>
}): JsonSchema<Partial<A>> =>
  JsonSchema<Partial<A>>({
    ...unknownRecord,
    properties,
  })

export const requiredKeys = <A extends ReadonlyRecord<string, any>>(properties: {
  readonly [K in keyof A]: JsonSchema<A[K]>
}) => JsonSchema<{ readonly [K in keyof A]: unknown }>({ required: Object.keys(properties) })

export const additionalProperties = <A>(
  schema: JsonSchema<A>,
): JsonSchema<A & ReadonlyRecord<string, unknown>> =>
  JsonSchema({
    ...schema,
    additionalProperties: true,
  })

export const struct = <A extends ReadonlyRecord<string, any>>(properties: {
  readonly [K in keyof A]: JsonSchema<A[K]>
}): JsonSchema<A> => JsonSchema<A>({ ...partial(properties), ...requiredKeys(properties) })

export const maybe = <A>(schema: JsonSchema<A>): JsonSchema<Maybe<A>> =>
  union(
    struct<Nothing>({ tag: exactly('Nothing') }),
    struct<Just<A>>({ tag: exactly('Just'), value: schema }),
  )

export const either = <E, A>(E: JsonSchema<E>, A: JsonSchema<A>): JsonSchema<Either<E, A>> =>
  union(
    struct<Left<E>>({ tag: exactly('Left'), left: E }),
    struct<Right<A>>({ tag: exactly('Right'), right: A }),
  )

export const these = <E, A>(E: JsonSchema<E>, A: JsonSchema<A>): JsonSchema<These<E, A>> =>
  union(
    struct<Left<E>>({ tag: exactly('Left'), left: E }),
    struct<Right<A>>({ tag: exactly('Right'), right: A }),
    struct<Both<E, A>>({ tag: exactly('Both'), left: E, right: A }),
  )
