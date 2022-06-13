import { ReadonlyRecord } from 'hkt-ts/Record'
import { Refinement } from 'hkt-ts/Refinement'

import { RecordConstraints } from '@/JsonSchema/JsonSchema'

export const isUnknownRecord = (u: unknown): u is Readonly<Record<PropertyKey, unknown>> =>
  !!u && !Array.isArray(u) && typeof u === 'object'

export const isRecord =
  <A>(refinement: Refinement<unknown, A>, constraints?: RecordConstraints<string, A>) =>
  (u: unknown): u is ReadonlyRecord<string, A> => {
    if (!isUnknownRecord(u)) {
      return false
    }

    if (!constraints) {
      return Object.values(u).every(refinement)
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

    // TODO: How to best support patternProperties with a Refinement already provided to test based on values?
    if (patternProperties) {
      console.info(`Record.patternProperties is not yet supported by Refinements`)
    }

    return entries.every(([, x]) => refinement(x))
  }
