import { JsonSchema, JsonSchemaDefinition } from './JsonSchema'
import { union } from './union'

const null_ = JsonSchema<null>({ type: 'null' })

export { null_ as null }

export const nullable = <A>(schema: JsonSchemaDefinition<A>): JsonSchema<A | null> =>
  union(null_, schema)
