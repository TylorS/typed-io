import { GuardInterpreter } from './Interpreter'
import * as interpereters from './interpreters'

export const defaultGuardInterpreter = new GuardInterpreter(...Object.values(interpereters))

export const { interpret: toGuard } = defaultGuardInterpreter
