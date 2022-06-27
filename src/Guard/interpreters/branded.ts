import { pipe } from 'hkt-ts'
import { ValueOf } from 'hkt-ts/Branded'

import { Guard } from '../Guard'
import { GUARD, GuardOutputOf } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'

import { Register } from '@/internal'
import { BrandedSchema } from '@/schemas/core/branded'

declare module '@/schemas/core/branded' {
  export interface BrandedCapabilities<C, Branded> {
    readonly [GUARD]: GUARD extends keyof C
      ? GuardOutputOf<C> extends ValueOf<Branded>
        ? Guard<Branded>
        : never
      : never
  }
}

export const BrandedSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(BrandedSchema, (s) => pipe(s, i.toGuard)),
)
