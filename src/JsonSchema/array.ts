import { JSONSchema7 } from 'json-schema'

import { JsonSchema, JsonSchemaDefinition, JsonSchemaHKT } from './JsonSchema'

import * as AC from '@/Constraints/array'

export interface ArrayConstraints<A> extends AC.ArrayConstraints<JsonSchemaHKT, A> {}

export const array = <A>(items: JsonSchemaDefinition<A>, constraints?: ArrayConstraints<A>) =>
  JsonSchema<ReadonlyArray<A>>({
    type: 'array',
    contains: items as JSONSchema7,
    ...constraints,
  } as JsonSchema<A>)
