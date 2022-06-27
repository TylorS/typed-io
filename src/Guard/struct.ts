import { NonEmptyArray } from 'hkt-ts/NonEmptyArray'
import { ReadonlyRecord } from 'hkt-ts/Record'
import { Equals } from 'ts-toolbelt/out/Any/Equals'

import { AnyGuard, Guard, GuardHKT, OutputOf } from './Guard'
import { isUnknownRecord } from './record'
import { guardSharedConstraints } from './shared'

import { OmitJsonSchemaOnly } from '@/Constraints/shared'
import * as CS from '@/Constraints/struct'
import { Property } from '@/Schema'

export interface StructConstraints<
  Properties extends ReadonlyRecord<string, Property<AnyGuard, boolean>>,
  Additional extends AnyGuard = never,
  PatternProperties extends ReadonlyRecord<string, AnyGuard> = never,
  Dependencies extends ReadonlyRecord<
    keyof Properties & string,
    | Guard<CS.BuildStruct<GuardHKT, Properties>[keyof CS.BuildStruct<GuardHKT, Properties>]>
    | NonEmptyArray<keyof Properties & string>
  > = never,
> extends OmitJsonSchemaOnly<
    CS.StructConstraints<GuardHKT, Properties, Additional, PatternProperties, Dependencies>
  > {}

export const struct = <
  Properties extends ReadonlyRecord<string, Property<AnyGuard, boolean>>,
  Additional extends AnyGuard = never,
  PatternProperties extends ReadonlyRecord<string, AnyGuard> = never,
  Dependencies extends ReadonlyRecord<
    keyof Properties & string,
    | Guard<CS.BuildStruct<GuardHKT, Properties>[keyof CS.BuildStruct<GuardHKT, Properties>]>
    | NonEmptyArray<keyof Properties & string>
  > = never,
>(
  properties: Properties,
  constraints?: StructConstraints<Properties, Additional, PatternProperties, Dependencies>,
): Guard<
  CS.BuildStruct<GuardHKT, Properties> &
    {
      0: CS.StructAdditionalProperties<OutputOf<Additional>>
      1: unknown
    }[Equals<never, Additional>]
> => ({
  is: guardSharedConstraints(
    isUnknownRecord,
    constraints,
    (
      u,
    ): u is CS.BuildStruct<GuardHKT, Properties> &
      {
        0: CS.StructAdditionalProperties<OutputOf<Additional>>
        1: unknown
      }[Equals<never, Additional>] => {
      const entries = Object.entries(properties)

      for (const [key, prop] of entries) {
        if (prop.isOptional && !(key in u)) {
          continue
        }

        if (!(key in u) || !prop.value.is(u[key])) {
          return false
        }
      }

      if (!constraints) {
        return true
      }

      const { patternProperties, dependencies } = constraints

      if (patternProperties) {
        for (const [source, guard] of Object.entries(patternProperties)) {
          const regex = new RegExp(source, 'u')

          for (const [key, value] of entries) {
            if (regex.test(key) && !guard.is(value)) {
              return false
            }
          }
        }
      }

      if (dependencies) {
        for (const [key, guardOrKeys] of Object.entries(dependencies)) {
          if (key in u) {
            if (Array.isArray(guardOrKeys)) {
              if (guardOrKeys.some((k) => !(k in u))) {
                return false
              }
            } else {
              if (!(guardOrKeys as AnyGuard).is(u)) {
                return false
              }
            }
          }
        }
      }

      return true
    },
  ),
})
