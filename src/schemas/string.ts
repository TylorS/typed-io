import { pipe } from 'hkt-ts'
import { Refinement } from 'hkt-ts/Refinement'
import * as S from 'hkt-ts/string'

import { identity } from './Identity'

import { Annotation, makeAnnotation } from '@/Annotation/Annotation'
import { arbitrary } from '@/Arbitrary/ArbitrarySchema'
import { throwOnPoorSuccessRate } from '@/Arbitrary/throwOnPoorSuccessRate'
import { Constructor } from '@/Constructor/Constructor'
import { Decoder } from '@/Decoder/Decoder'
import { Encoder } from '@/Encoder/Encoder'
import {
  GetTypeFromStringConstraints,
  JsonSchema,
  StringConstraints,
} from '@/JsonSchema/JsonSchema'
import { jsonSchema } from '@/JsonSchema/JsonSchemaSchema'
import { Schema } from '@/Schema'

export const StringConstraintsAnnotation = makeAnnotation<
  StringConstraints<any, any> | undefined
>()('StringConstraints')

export function string<T extends string = never, T2 extends ReadonlyArray<string> = never>(
  constraints?: StringConstraints<T, T2>,
): Schema<
  Decoder<unknown, never, GetTypeFromStringConstraints<T, T2>>,
  Constructor<GetTypeFromStringConstraints<T, T2>, never, GetTypeFromStringConstraints<T, T2>>,
  Encoder<GetTypeFromStringConstraints<T, T2>, GetTypeFromStringConstraints<T, T2>>,
  JsonSchema<GetTypeFromStringConstraints<T, T2>>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  readonly [Annotation<typeof StringConstraintsAnnotation, StringConstraints<T, T2> | undefined>]
> {
  return pipe(
    identity(stringRefinementFromConstraints(constraints)),
    arbitrary((fc) => stringArbitraryFromConstraints(fc, constraints)),
    jsonSchema((j) => j.string<T, T2>(constraints)),
  ).addAnnotation(StringConstraintsAnnotation, constraints)
}

export function stringRefinementFromConstraints<
  T extends string = never,
  T2 extends ReadonlyArray<string> = never,
>(
  constraints?: StringConstraints<T, T2>,
): Refinement<unknown, GetTypeFromStringConstraints<T, T2>> {
  return (u): u is GetTypeFromStringConstraints<T, T2> => {
    if (!S.isString(u)) {
      return false
    }

    if (!constraints) {
      return true
    }

    if (constraints.const) {
      return u === constraints.const
    }

    if (constraints.enum) {
      return constraints.enum.some((s) => s === u)
    }

    const { minLength = 0, maxLength = Infinity } = constraints
    const validPattern = constraints.pattern ? constraints.pattern.test(u) : true

    return validPattern && u.length >= minLength && u.length <= maxLength
  }
}

export function stringArbitraryFromConstraints<
  T extends string = never,
  T2 extends ReadonlyArray<string> = never,
>(
  fc: typeof import('fast-check'),
  constraints?: StringConstraints<T, T2>,
): import('fast-check').Arbitrary<GetTypeFromStringConstraints<T, T2>> {
  type R = import('fast-check').Arbitrary<GetTypeFromStringConstraints<T, T2>>

  if (!constraints) {
    return fc.string() as R
  }

  if (constraints.const) {
    return fc.constant(constraints.const)
  }

  if (constraints.enum) {
    return fc.oneof(...constraints.enum.map(fc.constant)) as R
  }

  const fcConstraints: import('fast-check').StringSharedConstraints = {
    minLength: constraints.minLength,
    maxLength: constraints.maxLength,
  }
  const arb = fc.string(fcConstraints) as R

  if (constraints.pattern) {
    const regexp = constraints.pattern

    return arb.filter(throwOnPoorSuccessRate(`String.pattern`, (s) => regexp.test(s)))
  }

  return arb
}
