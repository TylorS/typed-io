import * as R from 'hkt-ts/Refinement'
import { pipe } from 'hkt-ts/function'
import * as N from 'hkt-ts/number'

import { identity } from './identity'
import { refine } from './refine'

import { arbitrary } from '@/Arbitrary/index'
import { debug } from '@/Debug/index'
import { equals } from '@/Eq/index'
import { jsonSchema } from '@/JsonSchema/SchemaJsonSchema'

export const integer = (constraints?: import('fast-check').IntegerConstraints) =>
  pipe(
    identity(pipe(N.isNumber, R.compose(N.isInteger))),
    equals(N.Eq.equals),
    debug(N.Debug.debug),
    arbitrary((fc) => fc.integer(constraints)),
    jsonSchema((j) => j.integer(constraints)),
    constraints ? refineIntegerConstraints(constraints) : (x) => x,
  )

export function refineIntegerConstraints(constraints: import('fast-check').IntegerConstraints) {
  return refine((n: number): n is N.Integer => {
    const { min = -Infinity, max = Infinity } = constraints

    return n >= min && n <= max
  })
}
