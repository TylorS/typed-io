import { ReadonlyRecord } from 'hkt-ts/Record'

import { Guard, GuardHKT } from './Guard'
import { guardSharedConstraints } from './shared'

import * as CR from '@/Constraints/record'
import { OmitJsonSchemaOnly } from '@/Constraints/shared'

export interface RecordConstraints<K extends string, A>
  extends OmitJsonSchemaOnly<CR.RecordConstraints<GuardHKT, K, A>> {}

export const isUnknownRecord = (u: unknown): u is Readonly<Record<PropertyKey, unknown>> =>
  !!u && !Array.isArray(u) && typeof u === 'object'

export const unknownRecord = Guard(isUnknownRecord)

export const record = <A, K extends string = string>(
  codomain: Guard<A>,
  constraints?: RecordConstraints<K, A>,
): Guard<ReadonlyRecord<K, A>> => ({
  is: guardSharedConstraints(isUnknownRecord, constraints, (u): u is ReadonlyRecord<K, A> => {
    if (!constraints) {
      return Object.values(u).every(codomain.is)
    }

    const entries = Object.entries(u)
    const { minProperties = 0, maxProperties = Infinity, patternProperties } = constraints
    const size = entries.length
    const withinRange = size >= minProperties && size <= maxProperties

    if (!withinRange) {
      return false
    }

    const hasRequiredKeys = (constraints.required ?? []).every((k) => k in u)

    if (!hasRequiredKeys) {
      return false
    }

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

    return entries.every(([, x]) => codomain.is(x))
  }),
})
