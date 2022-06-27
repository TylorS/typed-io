import { Integer } from 'hkt-ts/number'

import { Guard } from '../Guard'
import { GUARD } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'
import { IntegerConstraints, integer } from '../integer'

import { GetSharedType } from '@/Constraints/shared'
import { Register } from '@/internal'
import { IntegerSchema } from '@/schemas/core/integer'

declare module '@/schemas/core/integer' {
  export interface IntegerCapabilities<Const, Enum> {
    readonly [GUARD]: Guard<GetSharedType<Const, Enum, Integer>>
  }
}

export const IntegerSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(IntegerSchema, (s) => integer(s.constraints as IntegerConstraints<any, any> | undefined)),
)
