import { pipe } from 'hkt-ts'
import { map } from 'hkt-ts/Record'
import { Equals } from 'ts-toolbelt/out/Any/Equals'

import { Guard } from '../Guard'
import { GUARD, GuardOutputOf } from '../GuardSchema'
import { GuardInterpreter } from '../Interpreter'
import { struct } from '../struct'

import { StructAdditionalProperties } from '@/Constraints/struct'
import { AnySchema } from '@/Schema'
import { Register } from '@/internal'
import { StructSchema } from '@/schemas/core/struct'

declare module '@/schemas/core/struct' {
  export interface StructCapabilities<Props, Additional> {
    readonly [GUARD]: Guard<
      {
        0: {
          readonly [K in keyof Props]: GuardOutputOf<Props[K]['value']>
        } & StructAdditionalProperties<Additional>
        1: {
          readonly [K in keyof Props]: GuardOutputOf<Props[K]['value']>
        }
      }[Equals<never, Additional>]
    >
  }
}

export const StructSchemaGuardInterpereter = Register.make<GuardInterpreter>((i) =>
  i.add(StructSchema, (s) =>
    struct(
      pipe(
        s.props,
        map((s) => s.map(i.toGuard)),
      ),
      {
        ...s.constraints,
        patternProperties: s.constraints?.patternProperties
          ? pipe(s.constraints.patternProperties, map(i.toGuard))
          : undefined,
        dependencies: s.constraints?.dependencies
          ? pipe(
              s.constraints.dependencies,
              map((s) => (!Array.isArray(s) ? i.toGuard(s as AnySchema) : s)),
            )
          : undefined,
      },
    ),
  ),
)
