import * as Branded from 'hkt-ts/Branded'
import { Data } from 'hkt-ts/Data'
import { DataEither } from 'hkt-ts/DataEither'
import { Either } from 'hkt-ts/Either'
import { Json, JsonPrimitive } from 'hkt-ts/Json'
import { Maybe } from 'hkt-ts/Maybe'
import { NonEmptyArray } from 'hkt-ts/NonEmptyArray'
import { Progress } from 'hkt-ts/Progress'
import { ReadonlyRecord } from 'hkt-ts/Record'
import { RoseTree } from 'hkt-ts/RoseTree'
import { Tree } from 'hkt-ts/Tree'
import { unsafeCoerce } from 'hkt-ts/function'
import { Integer, NonNegativeInteger } from 'hkt-ts/number'
import * as JS from 'json-schema'
import { Equals } from 'ts-toolbelt/out/Any/Equals'
import { BuiltIn } from 'ts-toolbelt/out/Misc/BuiltIn'

import { Property, prop } from '@/Schema'

/* #region JsonSchema Core */
export type JsonSchema<A> = Branded.Branded<{ readonly Decoded: A }, ReadonlyDeep<JS.JSONSchema7>>

export type JsonSchemaDefinition<A> = Branded.Branded<
  { readonly Decoded: A },
  ReadonlyDeep<JS.JSONSchema7> | boolean
>

export type DecodedOf<T> = T extends boolean ? T : [T] extends [JsonSchema<infer R>] ? R : never

/**
 * Construct a JsonSchema that's tagged with the decoded value and optionally an ID.
 */
export const JsonSchema = <A>(schema: ReadonlyDeep<JS.JSONSchema7>): JsonSchema<A> =>
  unsafeCoerce({ $schema: 'json-schema.org/draft-07/schema#', ...schema })

/* #endregion */

/* #region JSON Schema Metadata Types */

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
 * All of the shared constraints for all JsonSchema
 */
export interface SharedConstraints<
  Const,
  Enum extends ReadonlyArray<any> = ReadonlyArray<Const>,
  Default = Const,
> {
  readonly $id?: string
  readonly $ref?: string
  readonly $schema?: JS.JSONSchema7Version
  readonly $comment?: string
  /**
   * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.4
   * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#appendix-A
   */
  readonly $defs?: ReadonlyRecord<string, JsonSchemaDefinition<any>>
  readonly title?: string
  readonly description?: string
  readonly default?: Default
  readonly examples?: ReadonlyArray<GetSharedType<Const, Enum, Json>>
  readonly const?: Const
  readonly enum?: Enum
}

export type GetSharedType<Const, Enum, Fallback> = {
  0: Const
  1: {
    0: Enum extends ReadonlyArray<any> ? Enum[number] : Enum
    1: Fallback
  }[Equals<never, Enum>]
}[Equals<never, Const>]

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
/* #endregion */

/* #region JSON Schema Primitives */
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

// String
export interface StringConstraints<
  Const extends string = never,
  Enum extends ReadonlyArray<string> = never,
  Format extends StringFormat = never,
> extends SharedConstraints<Const, Enum, string> {
  readonly minLength?: NonNegativeInteger
  readonly maxLength?: NonNegativeInteger
  readonly format?: Format
  readonly pattern?: RegExp
  readonly contentEncoding?: string
  readonly contentMediaType?: string
}

export type StringFormat =
  | 'date-time'
  | 'time'
  | 'date'
  | 'duration'
  | 'email'
  | 'idn-email'
  | 'hostname'
  | 'idn-hostname'
  | 'ipv4'
  | 'ipv6'
  | 'uuid'
  | 'uri'
  | 'uri-reference'
  | 'iri'
  | 'iri-reference'
  | 'json-pointer'
  | 'relative-json-pointer'
  | 'regex'

export type DateTime = Branded.Branded<'DateTime', string>
export const DateTime = Branded.Branded<DateTime>()

export type DateString = Branded.Branded<'DateString', string>
export const DateString = Branded.Branded<DateString>()

export type TimeString = Branded.Branded<'TimeString', string>
export const Time = Branded.Branded<TimeString>()

export type Duration = Branded.Branded<'Duration', string>
export const Duration = Branded.Branded<Duration>()

export type Email = Branded.Branded<'Email', string>
export const Email = Branded.Branded<Email>()

export type IdnEmail = Branded.Branded<'IdnEmail', string>
export const IdnEmail = Branded.Branded<IdnEmail>()

export type Hostname = Branded.Branded<'Hostname', string>
export const Hostname = Branded.Branded<Hostname>()

export type IdnHostname = Branded.Branded<'IdnHostname', string>
export const IdnHostname = Branded.Branded<IdnHostname>()

export type Ipv4 = Branded.Branded<'Ipv4', string>
export const Ipv4 = Branded.Branded<Ipv4>()

export type Ipv6 = Branded.Branded<'Ipv6', string>
export const Ipv6 = Branded.Branded<Ipv6>()

export type Uuid = Branded.Branded<'Uuid', string>
export const Uuid = Branded.Branded<Uuid>()

export type Uri = Branded.Branded<'Uri', string>
export const Uri = Branded.Branded<Uri>()

export type UriReference = Branded.Branded<'UriReference', string>
export const UriReference = Branded.Branded<UriReference>()

export type Iri = Branded.Branded<'Iri', string>
export const Iri = Branded.Branded<Iri>()

export type IriReference = Branded.Branded<'IriReference', string>
export const IriReference = Branded.Branded<IriReference>()

export type JsonPointer = Branded.Branded<'JsonPointer', string>
export const JsonPointer = Branded.Branded<JsonPointer>()

export type RelativeJsonPointer = Branded.Branded<'RelativeJsonPointer', string>
export const RelativeJsonPointer = Branded.Branded<RelativeJsonPointer>()

export type RegexSource = Branded.Branded<'RegexSource', string>
export const RegexSource = Branded.Branded<RegexSource>()

export interface StringFormatToBrandedString {
  ['date-time']: DateTime
  ['date']: DateString
  ['time']: TimeString
  ['duration']: Duration
  ['email']: Email
  ['idn-email']: IdnEmail
  ['hostname']: Hostname
  ['idn-hostname']: IdnHostname
  ['ipv4']: Ipv4
  ['ipv6']: Ipv6
  ['uuid']: Uuid
  ['uri']: Uri
  ['uri-reference']: UriReference
  ['iri']: Iri
  ['iri-reference']: IriReference
  ['json-pointer']: JsonPointer
  ['relative-json-pointer']: RelativeJsonPointer
  ['regex']: RegexSource
}

export type GetTypeFromStringConstraints<
  T extends string = never,
  T2 extends ReadonlyArray<string> = never,
  Format extends StringFormat = never,
> = {
  0: {
    0: Branded.Branded<Branded.BrandOf<StringFormatToBrandedString[Format]>, T>
    1: {
      0: Branded.Branded<Branded.BrandOf<StringFormatToBrandedString[Format]>, T2[number]>
      1: StringFormatToBrandedString[Format]
    }[Equals<never, T2>]
  }[Equals<never, T>]
  1: GetSharedType<T, T2, string>
}[Equals<never, Format>]

export const string = <
  T extends string = never,
  T2 extends ReadonlyArray<string> = never,
  Format extends StringFormat = never,
>({ pattern, ...constraints }: StringConstraints<T, readonly [...T2], Format> = {}): JsonSchema<
  GetTypeFromStringConstraints<T, readonly [...T2], Format>
> =>
  JsonSchema<GetTypeFromStringConstraints<T, readonly [...T2], Format>>({
    type: 'string',
    ...constraints,
    ...(pattern ? { pattern: pattern.source } : {}),
  })

// Integer
export interface IntegerConstraints<
  Const extends Integer = never,
  Enum extends ReadonlyArray<Integer> = never,
> extends SharedConstraints<Const, Enum, Integer> {
  readonly minimum?: Integer
  readonly maximum?: Integer
  readonly multipleOf?: Integer
  readonly exclusiveMaximum?: Integer
  readonly exclusiveMinimum?: Integer
}

export const integer = <Const extends Integer = never, Enum extends ReadonlyArray<Integer> = never>(
  constraints?: IntegerConstraints<Const, Enum>,
): JsonSchema<GetSharedType<Const, Enum, Integer>> =>
  JsonSchema<GetSharedType<Const, Enum, Integer>>({
    type: 'integer',
    ...constraints,
  })

// Number
export interface NumberConstraints<
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
> extends SharedConstraints<Const, Enum, number> {
  readonly minimum?: number
  readonly maximum?: number
  readonly multipleOf?: number
  readonly exclusiveMaximum?: number
  readonly exclusiveMinimum?: number
}

export const number = <Const extends number = never, Enum extends ReadonlyArray<number> = never>(
  constraints?: NumberConstraints<Const, Enum>,
): JsonSchema<GetSharedType<Const, Enum, number>> =>
  JsonSchema<number>({
    type: 'number',
    ...constraints,
  })

// Boolean
export const boolean = <Const extends boolean = never, Enum extends ReadonlyArray<boolean> = never>(
  constraints?: SharedConstraints<Const, Enum>,
): JsonSchema<GetSharedType<Const, Enum, boolean>> =>
  JsonSchema({ type: 'boolean', ...constraints })

const true_ = (constraints?: Omit<SharedConstraints<true>, 'const' | 'enum'>) =>
  boolean({
    ...constraints,
    const: true,
  })

const false_ = (constraints?: Omit<SharedConstraints<false>, 'const' | 'enum'>) =>
  boolean({
    ...constraints,
    const: false,
  })

export { true_ as true, false_ as false }

// Null
const null_ = JsonSchema<null>({ type: 'null' })

export { null_ as null }

export const nullable = <A>(schema: JsonSchema<A>): JsonSchema<A | null> =>
  JsonSchema({
    anyOf: [null_, schema],
  })

// Array
export interface ArrayConstraints<A> extends SharedConstraints<ReadonlyArray<A>> {
  readonly minContains?: number
  readonly maxContains?: number
  readonly uniqueItems?: boolean
  readonly default?: ReadonlyArray<A>
}

export const array = <A>(items: JsonSchema<A>, constraints?: ArrayConstraints<A>) =>
  JsonSchema<ReadonlyArray<A>>({
    type: 'array',
    contains: items,
    ...constraints,
  } as JS.JSONSchema7)

// Tuple
export interface TupleConstraints<A extends ReadonlyArray<any>> extends SharedConstraints<A> {
  readonly default?: A
}

export const tuple = <A extends ReadonlyArray<JsonSchemaDefinition<any>>>(
  items: readonly [...A],
  constraints: TupleConstraints<{ readonly [K in keyof A]: DecodedOf<A[K]> }> = {},
) =>
  JsonSchema<{ readonly [K in keyof A]: DecodedOf<A[K]> }>({
    type: 'array',
    items,
    minItems: items.length,
    maxItems: items.length,
    ...constraints,
  })

// Record

export interface RecordConstraints<K extends string, A>
  extends SharedConstraints<ReadonlyRecord<K, A>> {
  readonly maxProperties?: number
  readonly minProperties?: number
  readonly patternProperties?: ReadonlyRecord<string, JsonSchemaDefinition<A>>
  readonly required?: readonly K[]
  readonly default?: ReadonlyRecord<K, A>
}

export const record = <A, K extends string = string>(
  codomain: JsonSchemaDefinition<A>,
  constraints: RecordConstraints<K, A> = {},
) =>
  JsonSchema<ReadonlyRecord<K, A>>({
    type: 'object',
    ...constraints,
    additionalProperties: codomain,
  } as JS.JSONSchema7)

// Struct

export interface StructConstraints<
  A extends ReadonlyRecord<string, Property<JsonSchema<any>, boolean>>,
  K extends string,
  B,
> extends SharedConstraints<BuildStruct<A> & StructAdditionalProperties<B>> {
  readonly patternProperties?: ReadonlyRecord<string, JsonSchemaDefinition<string>>
  readonly propertyNames?: JsonSchemaDefinition<K> | undefined
  readonly additionalProperties?: JsonSchemaDefinition<B> | undefined
  readonly dependencies?: ReadonlyRecord<
    K,
    JsonSchemaDefinition<BuildStruct<A>[keyof BuildStruct<A>] | NonEmptyArray<K>>
  >
  readonly default?: BuildStruct<A> & StructAdditionalProperties<B>
}

export const struct = <
  A extends ReadonlyRecord<string, Property<JsonSchema<any>, boolean>>,
  K extends keyof A & string,
  B = never,
>(
  structure: A,
  constraints?: StructConstraints<A, K, B>,
): JsonSchema<BuildStruct<A> & StructAdditionalProperties<B>> => {
  const entries = Object.entries(structure)
  const required = entries.flatMap(([k, v]) => (v.isOptional ? [] : [k]))
  const properties = Object.fromEntries(entries.map(([k, v]) => [k, v.value] as const))

  return JsonSchema<BuildStruct<A> & StructAdditionalProperties<B>>({
    type: 'object',
    ...constraints,
    properties,
    required,
  })
}

// Wrapped in a conditional to unwrap the type in your editor, making a separate type to compact it just leads to double-wrapping
export type BuildStruct<A extends ReadonlyRecord<string, Property<any, boolean>>> = [
  {
    readonly [K in keyof A as A[K]['isOptional'] extends true ? K : never]?: DecodedOf<
      A[K]['value']
    >
  } & {
    readonly [K in keyof A as A[K]['isOptional'] extends false ? K : never]: DecodedOf<
      A[K]['value']
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

/* #region JSON Schema Constructors */
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
  <T extends Readonly<Record<PropertyKey, any>>>(constraints?: SharedConstraints<T>) =>
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

export const maybe = <A>(
  value: JsonSchema<A>,
  constraints?: SharedConstraints<Maybe<A>>,
): JsonSchema<Maybe<A>> =>
  sum<Maybe<A>>(constraints)('tag')({
    Nothing: struct({
      tag: prop(string({ const: 'Nothing' })),
    }),
    Just: struct({
      tag: prop(string({ const: 'Just' })),
      value: prop(value),
    }),
  })

export const either = <E, A>(
  left: JsonSchema<E>,
  right: JsonSchema<A>,
  constraints?: SharedConstraints<Either<E, A>>,
): JsonSchema<Either<E, A>> =>
  sum<Either<E, A>>(constraints)('tag')({
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

export const data = <A>(
  value: JsonSchema<A>,
  constraints?: SharedConstraints<Data<A>>,
): JsonSchema<Data<A>> =>
  sum<Data<A>>(constraints)('tag')({
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

export const dataEither = <E, A>(
  E: JsonSchema<E>,
  A: JsonSchema<A>,
  constraints?: SharedConstraints<DataEither<E, A>>,
): JsonSchema<DataEither<E, A>> => data(either(E, A), constraints)

export const tree = <P, C>(
  parent: JsonSchema<P>,
  child: JsonSchema<C>,
  constraints?: SharedConstraints<Tree<P, C>>,
): JsonSchema<Tree<P, C>> =>
  sum<Tree<P, C>>(constraints)('tag')({
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
