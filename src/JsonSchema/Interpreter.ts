import { JsonSchema } from './JsonSchema'
import { AnyJsonSchemaCapability, JsonSchemaOf } from './JsonSchemaSchema'

import { AnySchemaWith } from '@/Schema'
import { interpreter } from '@/internal'

export class JsonSchemaInterpreter extends interpreter<AnyJsonSchemaCapability, JsonSchema<any>>(
  'JsonSchema',
)<JsonSchemaInterpreter> {
  readonly toJsonSchema = <S extends AnySchemaWith<AnyJsonSchemaCapability>>(schema: S) =>
    this.interpreter.interpret(schema) as JsonSchemaOf<S>
}
