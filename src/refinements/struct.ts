import { ReadonlyRecord } from 'hkt-ts/Record'

import { isUnknownRecord } from './record'

import { BuildStruct, StructAdditionalProperties, StructConstraints } from '@/JsonSchema/JsonSchema'
import { Property } from '@/Schema'
import { Guard } from '@/Guard/Guard'

export const isStruct =
  <A extends ReadonlyRecord<string, Property<Guard<any>, boolean>>, K extends keyof A & string, B = never>(
    structure: A,
    constraints?: StructConstraints<A, K, B>,
  ) =>
  (u: unknown): u is BuildStruct<A> & StructAdditionalProperties<B> => {
    if (!isUnknownRecord(u)) {
      return false
    }

    const entries = Object.entries(structure)

    for (const [key, prop] of entries) {
      if (prop.isOptional && !(key in u)) {
        continue
      }

      prop.value.
    }

    return true
  }
