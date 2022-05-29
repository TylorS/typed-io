import * as L from 'hkt-ts/Law/Arbitrary'
import { Refinement } from 'hkt-ts/Refinement'
import { Stringify } from 'hkt-ts/Typeclass/Debug'
import { DeepEquals } from 'hkt-ts/Typeclass/Eq'
import { constTrue, pipe } from 'hkt-ts/function'
import * as N from 'hkt-ts/number'
import * as S from 'hkt-ts/string'

import { identity } from './identity'
import { refine } from './refine'
import { union } from './union'

import { arbitrary } from '@/Arbitrary/index'
import { debug } from '@/Debug/index'
import { equals } from '@/Eq/index'
import { Schema } from '@/Schema'

export const string = (
  constraints?: import('fast-check').StringSharedConstraints,
): Schema<unknown, never, string, string, never, string, unknown, []> =>
  pipe(
    identity(S.isString),
    equals(S.Eq.equals),
    debug(S.Debug.debug),
    arbitrary(L.string(constraints)),
    constraints ? refineStringConstraints(constraints) : (x) => x,
  )

export function refineStringConstraints(constraints: import('fast-check').StringSharedConstraints) {
  return refine((s: string): s is string => {
    const { minLength = 0, maxLength = Infinity } = constraints

    return s.length >= minLength && s.length <= maxLength
  })
}

export const float = (constraints?: import('fast-check').FloatConstraints) =>
  pipe(
    identity(N.isNumber),
    equals(N.Eq.equals),
    debug(N.Debug.debug),
    arbitrary(L.Arbitrary((fc) => fc.float(constraints))),
    constraints ? refineFloatConstraints(constraints) : (x) => x,
    refine(N.isFloat),
  )

export function refineFloatConstraints(constraints: import('fast-check').FloatConstraints) {
  return refine((n: number): n is N.Float => {
    const { min = -Infinity, max = Infinity } = constraints

    return n >= min && n <= max
  })
}

export const integer = (constraints?: import('fast-check').IntegerConstraints) =>
  pipe(
    identity(N.isNumber),
    equals(N.Eq.equals),
    debug(N.Debug.debug),
    arbitrary(L.Arbitrary((fc) => fc.integer(constraints))),
    constraints ? refineIntegerConstraints(constraints) : (x) => x,
    refine(N.isInteger),
  )

export function refineIntegerConstraints(constraints: import('fast-check').IntegerConstraints) {
  return refine((n: number): n is N.Integer => {
    const { min = -Infinity, max = Infinity } = constraints

    return n >= min && n <= max
  })
}

export const number = (
  constraints?: import('fast-check').IntegerConstraints & import('fast-check').FloatConstraints,
) => union(float(constraints), integer(constraints))

export const anything = (constraints?: import('fast-check').ObjectConstraints) =>
  pipe(
    identity(constTrue as Refinement<unknown, unknown>),
    equals(DeepEquals.equals),
    debug(Stringify.debug as (u: unknown) => string),
    arbitrary(L.Arbitrary((fc) => (constraints ? fc.anything(constraints) : fc.anything()))),
  )

export { anything as unknown }
