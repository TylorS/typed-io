import { Guard } from '../Guard'
import { GUARD } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'

import { Register } from '@/internal'
import { IdentitySchema } from '@/schemas/identity'

declare module '@/schemas/identity' {
  export interface IdentitySchemaCapabilities<A> {
    readonly [GUARD]: Guard<A>
  }
}

export const IdentitySchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(IdentitySchema, (s) => Guard(s.refinement)),
)
