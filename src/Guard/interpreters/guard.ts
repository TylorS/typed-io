import { GuardSchema } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'

import { Register } from '@/internal'

export const GuardSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(GuardSchema, (s) => s.guard),
)
