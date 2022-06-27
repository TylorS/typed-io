import { Guard } from '../Guard'
import { GUARD } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'
import { string } from '../string'

import { GetTypeFromStringConstraints } from '@/Constraints/string'
import { Register } from '@/internal'
import { StringSchema } from '@/schemas/core/string'

declare module '@/schemas/core/string' {
  export interface StringCapabilities<Const, Enum, Format> {
    readonly [GUARD]: Guard<GetTypeFromStringConstraints<Const, Enum, Format>>
  }
}

export const StringSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(StringSchema, (s) => string(s.constraints)),
)
