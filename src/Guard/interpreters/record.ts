import { pipe } from 'hkt-ts'
import { ReadonlyRecord, map } from 'hkt-ts/Record'

import { Guard } from '../Guard'
import { AnyGuardCapability, GUARD, GuardOutputOf } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'
import { record } from '../record'

import { AnySchemaWith } from '@/Schema'
import { Register } from '@/internal'
import { RecordSchema } from '@/schemas/core/record'

declare module '@/schemas/core/record' {
  export interface RecordCapabilities<C, K> {
    readonly [GUARD]: GUARD extends keyof C ? Guard<ReadonlyRecord<K, GuardOutputOf<C>>> : never
  }
}

export const RecordSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(RecordSchema, (s) =>
    record(i.toGuard(s.codomain as AnySchemaWith<AnyGuardCapability>), {
      ...s.constraints,
      patternProperties: s.constraints?.patternProperties
        ? pipe(
            s.constraints.patternProperties,
            map((s) => i.toGuard(s as unknown as AnySchemaWith<AnyGuardCapability>)),
          )
        : undefined,
    }),
  ),
)
