import * as R from 'hkt-ts/Refinement'
import { pipe } from 'hkt-ts/function'
import * as N from 'hkt-ts/number'

import { identity } from './identity'
import { refine } from './refine'

import { arbitrary } from '@/Arbitrary/index'
import { debug } from '@/Debug/index'
import { equals } from '@/Eq/index'
import { jsonSchema } from '@/JsonSchema/SchemaJsonSchema'

export const float = (constraints?: import('fast-check').FloatConstraints) =>
  pipe(
    identity(pipe(N.isNumber, R.compose(N.isFloat))),
    equals<N.Float>(N.Eq.equals),
    debug<N.Float>(N.Debug.debug),
    arbitrary<N.Float>((fc) => fc.float(constraints).map((n) => n as N.Float)),
    jsonSchema((j) => j.float(constraints)),
    constraints ? refineFloatConstraints(constraints) : (x) => x,
    refine(N.isFloat),
  )

export function refineFloatConstraints(constraints: import('fast-check').FloatConstraints) {
  return refine((n: number): n is N.Float => {
    const { min = -Infinity, max = Infinity } = constraints

    return n >= min && n <= max
  })
}
