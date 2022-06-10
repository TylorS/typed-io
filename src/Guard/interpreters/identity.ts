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

export class IdentitySchemaGuardInterpereter extends Register<GuardInterpreter> {
  constructor() {
    super((i) => i.addGuardInterpreter(IdentitySchema, (s) => Guard(s.refinement)))
  }
}
