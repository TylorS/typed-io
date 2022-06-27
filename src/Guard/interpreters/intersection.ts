import { Equals } from 'ts-toolbelt/out/Any/Equals'

import { Guard } from '../Guard'
import { AnyGuardCapability, GUARD, GuardOutputOf } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'
import { intersection } from '../intersection'

import { AnySchema, AnySchemaWith, CapabilitiesOf } from '@/Schema'
import { Register, ToIntersection } from '@/internal'
import { IntersectionSchema } from '@/schemas/core/intersection'

declare module '@/schemas/core/intersection' {
  export interface IntersectionCapabilities<Members extends readonly AnySchema[]> {
    readonly [GUARD]: {
      0: Guard<ToIntersection<{ readonly [K in keyof Members]: GuardOutputOf<Members[K]> }>>
      1: never
    }[Equals<
      unknown,
      {
        readonly [K in keyof Members]: GUARD extends keyof CapabilitiesOf<Members[K]>
          ? GuardOutputOf<Members[K]>
          : unknown
      }[number]
    >]
  }
}

export const IntersectionSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(IntersectionSchema, (s) =>
    intersection(...(s.members as ReadonlyArray<AnySchemaWith<AnyGuardCapability>>).map(i.toGuard)),
  ),
)
