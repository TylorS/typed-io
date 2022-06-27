import { Guard } from '../Guard'
import { GUARD } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'
import { number } from '../number'

import { GetSharedType } from '@/Constraints/shared'
import { Register } from '@/internal'
import { NumberSchema } from '@/schemas/core/number'

declare module '@/schemas/core/number' {
  export interface NumberCapabilities<Const, Enum> {
    readonly [GUARD]: Guard<GetSharedType<Const, Enum, number>>
  }
}

export const numberSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(NumberSchema, (s) => number(s.constraints as any)),
)
