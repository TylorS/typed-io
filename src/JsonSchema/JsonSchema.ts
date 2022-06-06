import * as Branded from 'hkt-ts/Branded'
import { Data } from 'hkt-ts/Data'
import { Either } from 'hkt-ts/Either'
import { JsonPrimitive } from 'hkt-ts/Json'
import { Maybe } from 'hkt-ts/Maybe'
import { NonEmptyArray } from 'hkt-ts/NonEmptyArray'
import { Progress } from 'hkt-ts/Progress'
import { ReadonlyRecord } from 'hkt-ts/Record'
import { RoseTree } from 'hkt-ts/RoseTree'
import { Tree } from 'hkt-ts/Tree'
import { flow, unsafeCoerce } from 'hkt-ts/function'
import { Integer, NonNegativeInteger } from 'hkt-ts/number'
import * as JS from 'json-schema'
import { Equals } from 'ts-toolbelt/out/Any/Equals'
import { ReadonlyDeep } from 'ts-toolbelt/out/Object/Readonly'

/* #region JsonSchema Core */
export type JsonSchema<A> = Branded.Branded<{ readonly Decoded: A }, ReadonlyDeep<JS.JSONSchema7>>

export type JsonSchemaDefinition<A> = Branded.Branded<
  { readonly Decoded: A },
  ReadonlyDeep<JS.JSONSchema7> | boolean
>

export type DecodedOf<T> = T extends boolean
  ? T
  : [T] extends [JsonSchemaDefinition<infer R>]
  ? R
  : never

/**
 * Construct a JsonSchema that's tagged with the decoded value and optionally an ID.
 */
export const JsonSchema = <A>(schema: ReadonlyDeep<JS.JSONSchema7>): JsonSchema<A> =>
  unsafeCoerce({ $schema: 'json-schema.org/draft-07/schema#', ...schema })

/* #endregion */

/* #region JSON Schema Metadata Types */

/**
 * All of the shared constraints for all JsonSchema
 */
export interface SharedConstraints
  extends ReadonlyDeep<
    Pick<
      JS.JSONSchema7,
      | '$id'
      | '$ref'
      | '$schema'
      | '$comment'
      | '$defs'
      | 'definitions'
      | 'enum'
      | 'const'
      | 'title'
      | 'description'
      | 'examples'
    >
  > {}

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
 * Create a Reference to a Schema defined within "definitions"
 */
export const definitionsRef =
  <A>() =>
  <Ref extends string>(id: Ref) =>
    $ref<A>()(`#/definitions/${id}`)

/**
 * Create a Reference
 */
export const self = <A>() => $ref<A>()('#')

export const $comment =
  (comment: string) =>
  <A>(jsonSchema: JsonSchema<A>): JsonSchema<A> =>
    JsonSchema<A>({ ...jsonSchema, $comment: comment })

export const $defs =
  <Defs extends ReadonlyRecord<string, JsonSchema<any>>>(defs: Defs) =>
  <A>(schema: JsonSchema<A>) =>
    JsonSchema<A>({ ...schema, $defs: { ...schema?.$defs, ...defs } })

export const definitions =
  <Defs extends ReadonlyRecord<string, JsonSchema<any>>>(defs: Defs) =>
  <A>(schema: JsonSchema<A>) =>
    JsonSchema<A>({ ...schema, definitions: { ...schema?.definitions, ...defs } })
/* #endregion */

/* #region JSON Schema Primitives */
export const unknown = JsonSchema<unknown>({
  type: ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'],
})

export const unknownRecord = JsonSchema<ReadonlyRecord<string, unknown>>({
  type: 'object',
})

export const unknownArray = JsonSchema<ReadonlyArray<unknown>>({
  type: 'array',
})

// String
export interface StringConstraints<
  T extends string = never,
  T2 extends ReadonlyArray<string> = never,
> extends SharedConstraints {
  readonly minLength?: NonNegativeInteger
  readonly maxLength?: NonNegativeInteger
  readonly patthern?: RegExp
  readonly default?: string
  readonly const?: T
  readonly enum?: T2
  readonly contentEncoding?: string
  readonly contentMediaType?: string
}

export const string = <T extends string = never, T2 extends ReadonlyArray<string> = never>(
  constraints?: StringConstraints<T, T2>,
): JsonSchema<
  {
    0: T
    1: {
      0: T2[number]
      1: string
    }[Equals<never, T2>]
  }[Equals<never, T>]
> =>
  JsonSchema({
    type: 'string',
    ...constraints,
  })

// Integer
export interface IntegerConstraints extends SharedConstraints {
  readonly minimum?: Integer
  readonly maximum?: Integer
  readonly multipleOf?: Integer
  readonly exclusiveMaximum?: Integer
  readonly exclusiveMinimum?: Integer
  readonly default?: Integer
}

export const integer = (constraints?: IntegerConstraints): JsonSchema<Integer> =>
  JsonSchema<Integer>({
    type: 'integer',
    ...constraints,
  })

// Number
export interface NumberConstraints extends SharedConstraints {
  readonly minimum?: number
  readonly maximum?: number
  readonly multipleOf?: number
  readonly exclusiveMaximum?: number
  readonly exclusiveMinimum?: number
  readonly default?: number
}

export const number = (constraints?: NumberConstraints): JsonSchema<number> =>
  JsonSchema<number>({
    type: 'number',
    ...constraints,
  })

// Boolean
export const boolean = (constraints?: SharedConstraints): JsonSchema<boolean> =>
  JsonSchema({ type: 'boolean', ...constraints })

const true_ = (constraints?: Omit<SharedConstraints, 'const' | 'enum'>) =>
  boolean({
    ...constraints,
    const: true,
  })

const false_ = (constraints?: Omit<SharedConstraints, 'const' | 'enum'>) =>
  boolean({
    ...constraints,
    const: false,
  })

export { true_ as true, false_ as false }

// Null
const null_ = JsonSchema({ type: 'null' })

export { null_ as null }

export const nullable = <A>(schema: JsonSchema<A>): JsonSchema<A | null> =>
  JsonSchema({
    anyOf: [null_, schema],
  })

// Array
export interface ArrayConstraints<A> extends SharedConstraints {
  readonly minContains?: number
  readonly maxContains?: number
  readonly uniqueItems?: boolean
  readonly default?: ReadonlyArray<A>
}

export const array = <A>(items: JsonSchema<A>, constraints?: ArrayConstraints<A>) =>
  JsonSchema<ReadonlyArray<A>>({
    type: 'array',
    contains: items,
    ...(constraints as JS.JSONSchema7),
  })

// Tuple
export interface TupleConstraints<A extends ReadonlyArray<JsonSchemaDefinition<any>>>
  extends SharedConstraints {
  readonly default?: { readonly [K in keyof A]: DecodedOf<A[K]> }
}

export const tuple = <A extends ReadonlyArray<JsonSchemaDefinition<any>>>(
  items: readonly [...A],
  constraints: TupleConstraints<A> = {},
) =>
  JsonSchema<{ readonly [K in keyof A]: DecodedOf<A[K]> }>({
    type: 'array',
    items,
    minItems: items.length,
    maxItems: items.length,
    ...(constraints as JS.JSONSchema7),
  })

// Record

export interface RecordConstraints<K extends string, A> extends SharedConstraints {
  readonly maxProperties?: number
  readonly minProperties?: number
  readonly patternProperties?: ReadonlyRecord<string, JsonSchemaDefinition<string>>
  readonly required?: readonly K[]
  readonly default?: ReadonlyRecord<K, A>
}

export const record = <A, K extends string = string>(
  codomain: JsonSchemaDefinition<A>,
  constraints: RecordConstraints<K, A> = {},
) =>
  JsonSchema<ReadonlyRecord<K, A>>({
    type: 'object',
    ...(constraints as JS.JSONSchema7),
    additionalProperties: codomain,
  })

// Struct

export class Property<A, IsOptional extends boolean> {
  static tag = 'Property' as const
  readonly tag = Property.tag

  constructor(readonly schema: JsonSchema<A>, readonly isOptional: IsOptional) {}

  readonly optional = () => new Property(this.schema, true)
  readonly required = () => new Property(this.schema, false)
}

export const prop = <A>(schema: JsonSchema<A>) => new Property(schema, false)

export interface StructConstraints<K extends string, B> extends SharedConstraints {
  readonly patternProperties?: ReadonlyRecord<string, JsonSchemaDefinition<string>>
  readonly propertyNames?: JsonSchemaDefinition<K> | undefined
  readonly additionalProperties?: JsonSchemaDefinition<B> | undefined
  readonly dependencies?: ReadonlyRecord<K, NonEmptyArray<K>>
}

export const struct = <
  A extends ReadonlyRecord<string, Property<any, boolean>>,
  K extends keyof A & string,
  B = never,
>(
  structure: A,
  constraints?: StructConstraints<K, B>,
): JsonSchema<BuildStruct<A> & StructAdditionalProperties<B>> => {
  const entries = Object.entries(structure)
  const required = entries.flatMap(([k, v]) => (v.isOptional ? [] : [k]))
  const properties = Object.fromEntries(entries.map(([k, v]) => [k, v.schema] as const))

  return JsonSchema<BuildStruct<A> & StructAdditionalProperties<B>>({
    type: 'object',
    ...(constraints as JS.JSONSchema7),
    properties,
    required,
  })
}

// Wrapped in a conditional to unwrap the type in your editor, making a separate type to compact it just leads to double-wrapping
export type BuildStruct<A extends ReadonlyRecord<string, Property<any, boolean>>> = [
  {
    readonly [K in keyof A as A[K]['isOptional'] extends true ? K : never]?: DecodedOf<
      A[K]['schema']
    >
  } & {
    readonly [K in keyof A as A[K]['isOptional'] extends false ? K : never]: DecodedOf<
      A[K]['schema']
    >
  },
] extends [infer R]
  ? { readonly [K in keyof R]: R[K] }
  : never

export type StructAdditionalProperties<A> = {
  0: ReadonlyRecord<string, A>
  1: unknown
}[Equals<never, A>]
/* #endregion */

/* #region JSONS Schema Constructors */
/**
 * Construct a JSON Schema from a JSON Primitive literal
 */
export const literal = <A extends JsonPrimitive>(value: A) =>
  JsonSchema<A>({
    type: typeof value as JsonSchema<A>['type'],
    const: value,
  })

/**
 * Construct a JSON Schema from a tuple of JSON Primitive literals
 */
export const oneOf = <A extends ReadonlyArray<JsonPrimitive>>(
  ...values: A
): JsonSchema<A[number]> => union(...values.map(literal))

/* #endregion /*

/* #region Combinators */
export const union = <A extends ReadonlyArray<JsonSchemaDefinition<any>>>(
  ...schemas: A
): JsonSchema<DecodedOf<A[number]>> =>
  JsonSchema({
    anyOf: [...schemas],
  })

export const intersection = <A extends ReadonlyArray<JsonSchemaDefinition<any>>>(
  ...schemas: A
): JsonSchema<ToIntersection<A>> =>
  JsonSchema({
    allOf: [...schemas],
  })

type ToIntersection<A extends ReadonlyArray<any>, R = unknown> = A extends readonly [
  infer Head,
  ...infer Tail,
]
  ? ToIntersection<Tail, R & DecodedOf<Head>>
  : { readonly [K in keyof R]: R[K] }

export const sum =
  <T extends Readonly<Record<PropertyKey, any>>>(constraints?: SharedConstraints) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <Tag extends keyof T>(_tag: Tag) =>
  <A extends SumJsonSchemas<T, Tag>>(schemas: A): JsonSchema<T> =>
    JsonSchema<T>({
      ...constraints,
      oneOf: Object.values(schemas),
    })

export type SumJsonSchemas<T, Tag extends keyof T> = {
  readonly [K in T[Tag] & string]: JsonSchema<FindSumSchema<T, Tag, K>>
}

export type FindSumSchema<T, Tag extends keyof T, K extends T[Tag]> = T extends {
  readonly [_ in Tag]: K
}
  ? T
  : never
/* #endregion */

/* #region  HKT-TS Integrations */
export const branded =
  <B extends Branded.Branded<any, any>>() =>
  (schema: JsonSchema<Branded.ValueOf<B>>): JsonSchema<B> =>
    unsafeCoerce(schema)

export const maybe = <A>(value: JsonSchema<A>): JsonSchema<Maybe<A>> =>
  sum<Maybe<A>>()('tag')({
    Nothing: struct({
      tag: prop(string({ const: 'Nothing' })),
    }),
    Just: struct({
      tag: prop(string({ const: 'Just' })),
      value: prop(value),
    }),
  })

export const either = <E, A>(left: JsonSchema<E>, right: JsonSchema<A>): JsonSchema<Either<E, A>> =>
  sum<Either<E, A>>()('tag')({
    Left: struct({
      tag: prop(string({ const: 'Left' })),
      left: prop(left),
    }),
    Right: struct({
      tag: prop(string({ const: 'Right' })),
      right: prop(right),
    }),
  })

export const progress = (
  loaded: JsonSchema<number> = number(),
  total: JsonSchema<number> = number(),
): JsonSchema<Progress> =>
  struct({
    loaded: prop(loaded),
    total: prop(maybe(total)),
  })

export const data = <A>(value: JsonSchema<A>): JsonSchema<Data<A>> =>
  sum<Data<A>>()('tag')({
    NoData: struct({
      tag: prop(string({ const: 'NoData' })),
    }),
    Pending: struct({
      tag: prop(string({ const: 'Pending' })),
      progress: prop(maybe(progress())),
    }),
    Refreshing: struct({
      tag: prop(string({ const: 'Refreshing' })),
      value: prop(value),
      progress: prop(maybe(progress())),
    }),
    Replete: struct({
      tag: prop(string({ const: 'Replete' })),
      value: prop(value),
    }),
  })

export const dataEither = flow(either, data)

export const tree = <P, C>(parent: JsonSchema<P>, child: JsonSchema<C>): JsonSchema<Tree<P, C>> =>
  sum<Tree<P, C>>()('tag')({
    Parent: struct({
      tag: prop(string({ const: 'Parent' })),
      value: prop(parent),
      forest: prop(array(self<Tree<P, C>>())),
    }),
    Leaf: struct({
      tag: prop(string({ const: 'Leaf' })),
      value: prop(child),
    }),
  })

export const roseTree = <A>(value: JsonSchema<A>): JsonSchema<RoseTree<A>> => tree(value, value)

/* #endregion */
