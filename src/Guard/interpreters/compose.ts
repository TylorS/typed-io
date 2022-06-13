import * as Guard from '../Guard'
import { AnyGuardCapability, GUARD } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'

import { AnyCapabilities, AnySchemaWith } from '@/Schema'
import { Register } from '@/internal'
import { ComposeSchema } from '@/schemas/core/compose'

declare module '@/schemas/core/compose' {
  export interface ComposeCapabilities<C1 extends AnyCapabilities, C2 extends AnyCapabilities> {
    readonly [GUARD]: GUARD extends keyof C1
      ? GUARD extends keyof C2
        ? [C1[GUARD], C2[GUARD]] extends [Guard.Guard<infer A>, Guard.Guard<infer B>]
          ? Guard.Guard<A & B>
          : never
        : never
      : never
  }
}

export const ComposeSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(ComposeSchema, (s) =>
    Guard.and(i.toGuard(s.right as AnySchemaWith<AnyGuardCapability>))(
      i.toGuard(s.left as AnySchemaWith<AnyGuardCapability>),
    ),
  ),
)
