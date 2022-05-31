import { pipe } from 'hkt-ts/function'
import * as S from 'hkt-ts/string'

import { identity } from './identity'
import { refine } from './refine'

import { arbitrary } from '@/Arbitrary/index'
import { debug } from '@/Debug/index'
import { equals } from '@/Eq/index'
import { jsonSchema } from '@/JsonSchema/SchemaJsonSchema'
import { Schema } from '@/Schema'

export const string = (
  constraints?: import('fast-check').StringSharedConstraints,
): Schema<unknown, never, string, string, never, string, unknown, []> =>
  pipe(
    identity(S.isString),
    equals(S.Eq.equals),
    debug(S.Debug.debug),
    arbitrary((fc) => fc.string(constraints)),
    jsonSchema((j) => j.string(constraints)),
    constraints ? refineStringConstraints(constraints) : (x) => x,
  )

export function refineStringConstraints(constraints: import('fast-check').StringSharedConstraints) {
  return refine((s: string): s is string => {
    const { minLength = 0, maxLength = Infinity } = constraints

    return s.length >= minLength && s.length <= maxLength
  })
}
