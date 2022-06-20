import { ReadonlyRecord } from 'hkt-ts/Record'
import { JSONSchema7 } from 'json-schema'

import { JsonSchema, JsonSchemaDefinition, JsonSchemaHKT } from './JsonSchema'

import * as RC from '@/Constraints/record'

export interface RecordConstraints<K extends string, A>
  extends RC.RecordConstraints<JsonSchemaHKT, K, A> {}

export const record = <A, K extends string = string>(
  codomain: JsonSchemaDefinition<A>,
  constraints?: RecordConstraints<K, A>,
) =>
  JsonSchema<ReadonlyRecord<K, A>>({
    type: 'object',
    ...constraints,
    additionalProperties: codomain,
  } as JSONSchema7)
