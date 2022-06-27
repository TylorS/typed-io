import { JsonSchemaInterpreter } from './Interpreter'
import * as interpereters from './interpreters'

export const defaultJsonSchemaInterpreter: JsonSchemaInterpreter = new JsonSchemaInterpreter(
  ...Object.values(interpereters),
)

export const { toJsonSchema } = defaultJsonSchemaInterpreter
