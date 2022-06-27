import { JsonSchemaInterpreter } from '../Interpreter'
import { JsonSchemaSchema } from '../JsonSchemaSchema'

import { Register } from '@/internal'

export const JsonSchemaSchemaJsonSchemaInterpereter = Register.make<JsonSchemaInterpreter>((i) =>
  i.add(JsonSchemaSchema, (s) => s.jsonSchema(i.interpreter.interpret as any)),
)
