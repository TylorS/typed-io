import { Guard } from '../Guard'
import { AnyGuardCapability, GUARD, GuardOutputOf } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'
import { tuple } from '../tuple'

import { AnySchema, AnySchemaWith } from '@/Schema'
import { Register } from '@/internal'
import { TupleSchema } from '@/schemas/core/tuple'

declare module '@/schemas/core/tuple' {
  export interface TupleCapabilities<Members> {
    readonly [GUARD]: ToTupleGuard<Members>
  }
}

export type ToTupleGuard<
  Members extends ReadonlyArray<AnySchema>,
  R extends readonly any[] = [],
> = Members extends readonly [
  infer Head extends AnySchema,
  ...infer Tail extends ReadonlyArray<AnySchema>,
]
  ? ToTupleGuard<Tail, [...R, GuardOutputOf<Head>]>
  : Guard<R>

export const TupleSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(TupleSchema, (s) =>
    tuple(
      (s.members as ReadonlyArray<AnySchemaWith<AnyGuardCapability>>).map(i.toGuard),
      s.constraints,
    ),
  ),
)
