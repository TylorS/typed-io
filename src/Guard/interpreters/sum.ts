import { pipe } from 'hkt-ts'
import { map } from 'hkt-ts/Record'

import { Guard } from '../Guard'
import { GUARD, GuardOutputOf } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'
import { sum } from '../sum'

import { Compact, Register } from '@/internal'
import { AnySumMembers, SumSchema } from '@/schemas/core/sum'

declare module '@/schemas/core/sum' {
  export interface SumCapabilities<Tag extends string, Members extends AnySumMembers> {
    readonly [GUARD]: [keyof Members] extends [never]
      ? Guard<unknown>
      : Guard<Compact<ToSumGuardOutput<Tag, Members>>>
  }
}

export type ToSumGuardOutput<Tag extends string, Members extends AnySumMembers> = {
  readonly [K in keyof Members]: Compact<GuardOutputOf<Members[K]> & { readonly [_ in Tag]: K }>
}[keyof Members]

export const SumSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(SumSchema, (s) => sum()(s.tag)(pipe(s.members, map(i.toGuard as any)) as any)),
)
