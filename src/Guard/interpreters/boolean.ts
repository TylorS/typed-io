import { Guard } from '../Guard'
import { GUARD } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'
import { boolean } from '../boolean'

import { GetSharedType } from '@/Constraints/shared'
import { Register } from '@/internal'
import { BooleanSchema } from '@/schemas/core/boolean'

declare module '@/schemas/core/boolean' {
  export interface BooleanCapabilities<Const, Enum> {
    readonly [GUARD]: Guard<GetSharedType<Const, Enum, boolean>>
  }
}

export const BooleanSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(BooleanSchema, (s) => boolean(s.constraints)),
)
