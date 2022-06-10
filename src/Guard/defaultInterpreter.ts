import { GuardInterpreter } from './Interpreter'
import { IdentitySchemaGuardInterpereter } from './interpreters/identity'

export const defaultGuardInterpreter = new GuardInterpreter(IdentitySchemaGuardInterpereter)
export const { toGuard, addGuardInterpreter } = defaultGuardInterpreter
