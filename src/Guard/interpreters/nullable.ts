import { Guard } from '../Guard'
import { AnyGuardCapability, GUARD, GuardOutputOf } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'
import { nullable } from '../nullable'

import { AnySchemaWith } from '@/Schema'
import { Register } from '@/internal'
import { NullableSchema } from '@/schemas/core/nullable'

declare module '@/schemas/core/nullable' {
  export interface NullableCapabilities<C> {
    readonly [GUARD]: GUARD extends keyof C ? Guard<GuardOutputOf<C> | null> : never
  }
}

export const NullableSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(NullableSchema, (s) => nullable(i.toGuard(s.schema as AnySchemaWith<AnyGuardCapability>))),
)
