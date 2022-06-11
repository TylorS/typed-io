import { GuardInterpreter } from './Interpreter'
import { ComposeSchemaGuardInterpereter } from './interpreters/compose'
import { GuardSchemaGuardInterpereter } from './interpreters/guard'
import { IdentitySchemaGuardInterpereter } from './interpreters/identity'

export const defaultGuardInterpreter = new GuardInterpreter(
  IdentitySchemaGuardInterpereter,
  ComposeSchemaGuardInterpereter,
  GuardSchemaGuardInterpereter,
)

export const { interpret: toGuard } = defaultGuardInterpreter
