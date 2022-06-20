import { NonEmptyArray } from 'hkt-ts/NonEmptyArray'
import { ReadonlyRecord } from 'hkt-ts/Record'

import { JsonSchema, JsonSchemaDefinition, JsonSchemaHKT } from './JsonSchema'

import * as SC from '@/Constraints/struct'
import { Property } from '@/Schema'

export interface StructConstraints<
  Properties extends ReadonlyRecord<string, Property<JsonSchemaDefinition<any>, boolean>>,
  Additional extends JsonSchemaDefinition<any> = never,
  PatternProperties extends ReadonlyRecord<string, JsonSchema<string>> = never,
  Dependencies extends ReadonlyRecord<
    keyof Properties & string,
    JsonSchemaDefinition<any> | NonEmptyArray<keyof Properties & string>
  > = never,
> extends SC.StructConstraints<
    JsonSchemaHKT,
    Properties,
    Additional,
    PatternProperties,
    Dependencies
  > {}

export const struct = <
  Properties extends ReadonlyRecord<string, Property<JsonSchemaDefinition<any>, boolean>>,
  Additional extends JsonSchemaDefinition<any> = never,
  PatternProperties extends ReadonlyRecord<string, JsonSchema<string>> = never,
  Dependencies extends ReadonlyRecord<
    keyof Properties & string,
    JsonSchemaDefinition<any> | NonEmptyArray<keyof Properties & string>
  > = never,
>(
  structure: Properties,
  constraints?: StructConstraints<Properties, Additional, PatternProperties, Dependencies>,
) => {
  const entries = Object.entries(structure)
  const required = entries.flatMap(([k, v]) => (v.isOptional ? [] : [k]))
  const properties = Object.fromEntries(entries.map(([k, v]) => [k, v.value] as const))

  return JsonSchema<
    SC.BuildStruct<JsonSchemaHKT, Properties> & SC.StructAdditionalProperties<Additional>
  >({
    type: 'object',
    ...constraints,
    properties,
    required,
  })
}
