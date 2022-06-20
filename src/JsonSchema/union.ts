import { JsonSchema, JsonSchemaDefinition } from './JsonSchema'

export const union = <A extends ReadonlyArray<any>>(
  ...schemas: { readonly [K in keyof A]: JsonSchemaDefinition<A[K]> }
): JsonSchema<A[number]> =>
  JsonSchema({
    anyOf: schemas,
  })
