import { Right } from 'hkt-ts/Either'
import { JsonPrimitive } from 'hkt-ts/Json'
import { Refinement, or } from 'hkt-ts/Refinement'
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
import { Schema } from '@/Schema'

export const string = (
  constraints?: import('fast-check').StringSharedConstraints,
): Schema<unknown, never, string, string, never, string, unknown, []> =>
  pipe(
    identity(S.isString),
    equals(S.Eq.equals),
    debug(S.Debug.debug),
    arbitrary((fc) => fc.string(constraints)),
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
    arbitrary((fc) => fc.float(constraints)),
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
    arbitrary((fc) => fc.integer(constraints)),
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

const commonBool_ = pipe(identity<boolean>(B.isBoolean), equals(B.Eq.equals), debug(B.Debug.debug))

export const boolean = pipe(
  commonBool_,
  arbitrary<boolean>((fc) => fc.boolean()),
)

const true_ = pipe(
  commonBool_,
  refine<boolean, true>((x): x is true => x === true),
  arbitrary<true>((fc) => fc.constant(true)),
  encode((t: true) => t),
  construct((t: true) => Right(t)),
)

const false_ = pipe(
  commonBool_,
  refine<boolean, false>((x): x is false => x === false),
  arbitrary<false>((fc) => fc.constant(false)),
  construct((f: false) => Right(f)),
  encode((f: false) => f),
)

export { true_ as true, false_ as false }

export const anything = (constraints?: import('fast-check').ObjectConstraints) =>
  pipe(
    identity(constTrue as Refinement<unknown, unknown>),
    equals(DeepEquals.equals),
    debug(Stringify.debug as (u: unknown) => string),
    arbitrary((fc) => (constraints ? fc.anything(constraints) : fc.anything())),
  )

export { anything as unknown }

export const literal = <A extends JsonPrimitive>(value: A) =>
  pipe(
    identity<A>((u): u is A => u === value),
    equals<A>(Strict.equals),
    debug<A>(Stringify.debug),
    arbitrary<A>((fc) => fc.constant(value)),
  )

const isJsonPrimitive: Refinement<unknown, JsonPrimitive> = pipe(
  N.isNumber,
  or(B.isBoolean),
  or(S.isString),
  or((u: unknown): u is null => u === null),
)

export const oneOf = <A extends ReadonlyArray<JsonPrimitive>>(...values: A) =>
  pipe(
    identity<A[number]>((u): u is A[number] => isJsonPrimitive(u) && values.includes(u)),
    equals<A[number]>(Strict.equals),
    debug<A[number]>(Stringify.debug),
    arbitrary<A[number]>((fc) => fc.constantFrom(...values)),
  )
