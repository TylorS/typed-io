import * as Guard from '../Guard'
import { AnyGuardCapability, GUARD, GuardOutputOf } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'

import { AnyCapabilities, AnySchemaWith } from '@/Schema'
import { Register } from '@/internal'
import { ComposeSchema } from '@/schemas/compose'

declare module '@/schemas/compose' {
  export interface ComposeCapabilities<C1 extends AnyCapabilities, C2 extends AnyCapabilities> {
    readonly [GUARD]: Guard.Guard<
      GuardOutputOf<AnySchemaWith<C1>> & GuardOutputOf<AnySchemaWith<C2>>
    >
  }
}

export const ComposeSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(ComposeSchema, (s) =>
    Guard.and(i.interpret(s.right as AnySchemaWith<AnyGuardCapability>))(
      i.interpret(s.left as AnySchemaWith<AnyGuardCapability>),
    ),
  ),
)
