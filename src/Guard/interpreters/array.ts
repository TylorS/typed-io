import { Guard, OutputOf } from '../Guard'
import { AnyGuardCapability, GUARD } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'
import { array } from '../array'

import { AnySchemaWith } from '@/Schema'
import { Register } from '@/internal'
import { ArraySchema } from '@/schemas/core/array'

declare module '@/schemas/core/array' {
  export interface ArrayCapabilities<C> {
    readonly [GUARD]: GUARD extends keyof C ? Guard<ReadonlyArray<OutputOf<C[GUARD]>>> : never
  }
}

export const ArraySchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(ArraySchema, (s) =>
    array(i.toGuard(s.member as AnySchemaWith<AnyGuardCapability>), s.constraints),
  ),
)
