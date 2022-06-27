import { Equals } from 'ts-toolbelt/out/Any/Equals'

import { Guard } from '../Guard'
import { AnyGuardCapability, GUARD, GuardOutputOf } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'
import { union } from '../union'

import { AnySchema, AnySchemaWith, CapabilitiesOf } from '@/Schema'
import { Register } from '@/internal'
import { UnionSchema } from '@/schemas/core/Union'

declare module '@/schemas/core/union' {
  export interface UnionCapabilities<Members extends readonly AnySchema[]> {
    readonly [GUARD]: { 0: Guard<GuardOutputOf<Members[number]>>; 1: never }[Equals<
      unknown,
      {
        readonly [K in keyof Members]: GUARD extends keyof CapabilitiesOf<Members[K]>
          ? GuardOutputOf<Members[K]>
          : unknown
      }[number]
    >]
  }
}

export const UnionSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(UnionSchema, (s) =>
    union(...(s.members as ReadonlyArray<AnySchemaWith<AnyGuardCapability>>).map(i.toGuard)),
  ),
)
