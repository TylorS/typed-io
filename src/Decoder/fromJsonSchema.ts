import { ValueOf } from 'hkt-ts/Branded'
import { NonEmptyArray, isNonEmpty } from 'hkt-ts/NonEmptyArray'
import { Integer } from 'hkt-ts/number'
import { Cast } from 'ts-toolbelt/out/Any/Cast'

import { AnyDecoder, Decoder } from './Decoder'
import { ArrayErrors, array } from './array'
import { BooleanErrors, boolean } from './boolean'
import { IntegerErrors, integer } from './integer'
import { intersection } from './intersection'
import * as N from './nullable'
import { NumberErrors, number } from './number'
import { record } from './record'
import { StringErrors, string } from './string'
import { struct } from './struct'
import { TupleErrors, tuple } from './tuple'
import { union } from './union'
import { unknown } from './unknown'
import { unknkownArray } from './unknownArray'
import { unknownRecord } from './unknownRecord'

import { JsonSchema } from '@/JsonSchema/JsonSchema'
import { FromJsonSchema, GetKeys, ObjectBaseSchema } from '@/JsonSchema/type-level'
import { Property } from '@/Schema'
import {
  DependencyError,
  PatternPropertiesError,
  ToRoseTree,
  UnknownRecordError,
} from '@/SchemaError/BuiltinErrors'

export type FromJsonSchemaDecoder<S extends JsonSchema<any> | ValueOf<JsonSchema<any>> | boolean> =
  Decoder<unknown, ErrorsFromJsonSchema<S>, FromJsonSchema<S>>

/**
 * Assumes that the JsonSchema provided here will already be de-referenced.
 */
export function fromJsonSchema<S extends JsonSchema<any> | ValueOf<JsonSchema<any>> | boolean>(
  schema: S,
): FromJsonSchemaDecoder<S> {
  type R = FromJsonSchemaDecoder<S>

  if (typeof schema === 'boolean') {
    return boolean({ const: schema }) as unknown as R
  }

  switch (schema.type) {
    case 'array': {
      if (schema.items instanceof Array && isNonEmpty(schema.items)) {
        return tuple(
          schema.items.map(fromJsonSchema) as unknown as NonEmptyArray<AnyDecoder>,
          schema as any,
        ) as unknown as R
      }

      if (schema.items !== undefined) {
        return array(fromJsonSchema(schema), schema as any) as unknown as R
      }

      return unknkownArray as unknown as R
    }
    case 'boolean': {
      return boolean(schema as any) as unknown as R
    }
    case 'integer': {
      return integer(schema as any) as unknown as R
    }
    case 'null': {
      return N.null as unknown as R
    }
    case 'number': {
      return number(schema as any) as unknown as R
    }
    case 'object': {
      if (schema.properties !== undefined) {
        const { required = [] } = schema

        return struct(
          Object.fromEntries(
            Object.entries(schema.properties).map(([k, v]) => [
              k,
              new Property(fromJsonSchema(v), !required.includes(k)),
            ]),
          ),
          schema as any,
        ) as unknown as R
      }

      if (schema.additionalProperties !== undefined) {
        return record(
          fromJsonSchema(schema.additionalProperties) as any,
          schema as any,
        ) as unknown as R
      }

      return unknownRecord as unknown as R
    }
    case 'string': {
      return string(schema as any) as unknown as R
    }
    default: {
      if (schema.anyOf) {
        return union(
          ...(schema.anyOf.map(fromJsonSchema) as unknown as NonEmptyArray<AnyDecoder>),
        ) as unknown as R
      }

      if (schema.oneOf) {
        return union(
          ...(schema.oneOf.map(fromJsonSchema) as unknown as NonEmptyArray<AnyDecoder>),
        ) as unknown as R
      }

      if (schema.allOf) {
        return intersection(
          ...(schema.allOf.map(fromJsonSchema) as unknown as NonEmptyArray<AnyDecoder>),
        ) as unknown as R
      }

      return unknown as unknown as R
    }
  }
}

export type ErrorsFromJsonSchemaMap<S extends ValueOf<JsonSchema<any>>> = {
  readonly Boolean: BooleanErrors<Cast<S['const'], boolean>, Cast<S['enum'], readonly boolean[]>>
  readonly String: StringErrors<Cast<S['const'], string>, Cast<S['enum'], readonly string[]>>
  readonly Number: NumberErrors<Cast<S['const'], number>, Cast<S['enum'], readonly number[]>>
  readonly Integer: IntegerErrors<Cast<S['const'], Integer>, Cast<S['enum'], readonly Integer[]>>
  readonly Null: never
  readonly Array: S extends { readonly contains: infer R }
    ? ArrayErrors<ErrorsFromJsonSchema<R>, FromJsonSchema<R>>
    : S extends { readonly items: readonly [...infer R] }
    ? TupleErrors<
        ErrorsFromJsonSchema<R[number]>,
        { readonly [K in keyof R]: FromJsonSchema<R[K]> }
      >
    : never
  readonly Object: S extends ObjectBaseSchema ? ErrorsFromJsonSchemaObject<S> : never
  readonly AllOf: S extends { readonly allOf: readonly [...infer R] }
    ? ErrorsFromJsonSchema<R[number]>
    : never
  readonly AnyOf: S extends { readonly anyOf: readonly [...infer R] }
    ? ErrorsFromJsonSchema<R[number]>
    : unknown
  readonly OneOf: S extends { readonly oneOf: readonly [...infer R] }
    ? ErrorsFromJsonSchema<R[number]>
    : unknown
}

export type FoldErrors<S, Keys extends ReadonlyArray<any>, R = unknown> = Keys extends readonly [
  infer Head extends keyof ErrorsFromJsonSchemaMap<S>,
  ...infer Tail,
]
  ? FoldErrors<S, Tail, R | ErrorsFromJsonSchemaMap<S>[Head]>
  : R

export type ErrorsFromJsonSchema<S> = S extends ValueOf<JsonSchema<any>> | JsonSchema<any>
  ? FoldErrors<S, GetKeys<S>>
  : never

export type ErrorsFromJsonSchemaObject<T extends ObjectBaseSchema> = T extends {
  readonly properties: infer Props
  readonly additionalProperties: infer Additional
  readonly patternProperties: infer PatternProperties
  readonly dependencies: infer Dependencies
}
  ?
      | UnknownRecordError
      | ErrorsFromJsonSchema<Additional>
      | {
          [K in keyof Props]: ErrorsFromJsonSchema<Props[K]>
        }[keyof Props]
      | {
          [K in keyof PatternProperties]: ErrorsFromJsonSchema<
            PatternProperties[K]
          > extends ToRoseTree
            ? PatternPropertiesError<FromJsonSchema<T>, ErrorsFromJsonSchema<PatternProperties[K]>>
            : PatternPropertiesError<FromJsonSchema<T>, never>
        }[keyof PatternProperties]
      | {
          [K in keyof Dependencies]: ErrorsFromJsonSchema<Dependencies[K]> extends ToRoseTree
            ? DependencyError<FromJsonSchema<T>, ErrorsFromJsonSchema<Dependencies[K]>>
            : DependencyError<FromJsonSchema<T>, never>
        }[keyof Dependencies]
  : T extends {
      readonly properties: infer Props
      readonly additionalProperties: infer Additional
      readonly patternProperties: infer PatternProperties
    }
  ?
      | UnknownRecordError
      | ErrorsFromJsonSchema<Additional>
      | {
          [K in keyof Props]: ErrorsFromJsonSchema<Props[K]>
        }[keyof Props]
      | {
          [K in keyof PatternProperties]: ErrorsFromJsonSchema<
            PatternProperties[K]
          > extends ToRoseTree
            ? PatternPropertiesError<FromJsonSchema<T>, ErrorsFromJsonSchema<PatternProperties[K]>>
            : PatternPropertiesError<FromJsonSchema<T>, never>
        }[keyof PatternProperties]
  : T extends {
      readonly properties: infer Props
      readonly additionalProperties: infer Additional
    }
  ?
      | UnknownRecordError
      | ErrorsFromJsonSchema<Additional>
      | {
          [K in keyof Props]: ErrorsFromJsonSchema<Props[K]>
        }[keyof Props]
  : T extends {
      readonly properties: infer Props
    }
  ?
      | UnknownRecordError
      | {
          [K in keyof Props]: ErrorsFromJsonSchema<Props[K]>
        }[keyof Props]
  : T extends {
      readonly additionalProperties: infer Additional
    }
  ? UnknownRecordError | ErrorsFromJsonSchema<Additional>
  : never
