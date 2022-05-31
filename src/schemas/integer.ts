import { Right } from 'hkt-ts/Either'
import { JsonPrimitive } from 'hkt-ts/Json'
import * as R from 'hkt-ts/Refinement'
import { Stringify } from 'hkt-ts/Typeclass/Debug'
import { DeepEquals, Strict } from 'hkt-ts/Typeclass/Eq'
import * as B from 'hkt-ts/boolean'
import { constTrue, pipe } from 'hkt-ts/function'
import * as N from 'hkt-ts/number'
import * as S from 'hkt-ts/string'

import { identity } from './identity'
import { refine } from './refine'
import { union } from './union'

import { arbitrary } from '@/Arbitrary/index'
import { construct } from '@/Constructor/SchemaConstructor'
import { debug } from '@/Debug/index'
import { encode } from '@/Encoder/SchemaEncoder'
import { equals } from '@/Eq/index'
import { jsonSchema } from '@/JsonSchema/SchemaJsonSchema'
import { Schema } from '@/Schema'

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
