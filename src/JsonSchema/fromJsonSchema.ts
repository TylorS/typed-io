import { JsonSchema, JsonSchemaDefinition } from './JsonSchema'

import { Schema } from '@/Schema'

export function fromJsonSchema<A>(schema: JsonSchemaDefinition<A>) {
  if (schema === true || schema === false) {
    return S.literal(schema) as any
  }

  switch (schema.type) {
    case 'array': {
      if (schema.items instanceof Array) {
        return fromJsonSchemaOrderedArray(schema)
      }

      if (schema.items !== undefined) {
        return fromJsonSchemaOUnorderedArray(schema)
      }

      return fromJsonSchemaUntypedArray(schema)
    }
    case 'boolean': {
      return fromJsonSchemaBoolean(schema)
    }
    case 'integer': {
      return schema.enum ? fromJsonSchemaIntergerEnum(schema) : fromJsonSchemaInteger(schema)
    }
    case 'null': {
      return fromJsonSchemaNull(schema)
    }
    case 'number': {
      return schema.enum ? fromJsonSchemaNumberEnum(schema) : fromJsonSchemaNumber(schema)
    }
    case 'object': {
      return schema.properties === undefined
        ? fromJsonScheamUntypedObject(schema)
        : fromJsonSchemaObject(schema)
    }
    case 'string': {
      return fromJsonSchemaString(schema)
    }
    default: {
      if (schema.anyOf) {
        return fromJsonSchemaAnyOf(schema)
      }

      if (schema.oneOf) {
        return fromJsonSchemaOneOf(schema)
      }

      if (schema.allOf) {
        return fromJsonSchemaAllOf(schema)
      }

      return fromJsonSchemaUntyped(schema)
    }
  }
}

export function fromJsonSchemaOrderedArray<A extends ReadonlyArray<any>>(
  schema: JsonSchema<A> & {
    readonly type: 'array'
    readonly items: { readonly [K in keyof A]: JsonSchema<A[K]> }
  },
)
