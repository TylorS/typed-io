import { Kind_, pipe } from 'hkt-ts'

import { Guard } from '../Guard'
import { GUARD, GuardOutputOf } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'

import { AnySchema } from '@/Schema'
import { Register } from '@/internal'
import { EnsureSchema } from '@/schemas/core/ensure'

declare module '@/schemas/core/ensure' {
  export interface EnsureCapabilitiesHKT<C, T, Schemas extends ReadonlyArray<AnySchema>> {
    readonly [GUARD]: GUARD extends keyof C
      ? Guard<Kind_<[T], { readonly [K in keyof Schemas]: GuardOutputOf<Schemas[K]> }>>
      : never
  }

  export interface EnsureCapabilitiesStatic<C, T> {
    readonly [GUARD]: GUARD extends keyof C
      ? [GuardOutputOf<C>] extends [T]
        ? Guard<T>
        : never
      : never
  }
}

export const EnsureSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(EnsureSchema, (s) => pipe(s, i.toGuard)),
)
