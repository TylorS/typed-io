import { pipe } from 'hkt-ts'
import { Refinement } from 'hkt-ts/Refinement'
import * as S from 'hkt-ts/string'

import { identity } from './Identity'

import { arbitrary } from '@/Arbitrary/ArbitrarySchema'
import { throwOnPoorSuccessRate } from '@/Arbitrary/throwOnPoorSuccessRate'
import { Constructor } from '@/Constructor/Constructor'
import { Decoder } from '@/Decoder/Decoder'
import { Encoder } from '@/Encoder/Encoder'
import {
  GetTypeFromStringConstraints,
  JsonSchema,
  StringConstraints,
  StringFormat,
} from '@/JsonSchema/JsonSchema'
import { jsonSchema } from '@/JsonSchema/JsonSchemaSchema'
import { Schema } from '@/Schema'

export function string<
  T extends string = never,
  T2 extends ReadonlyArray<string> = never,
  Format extends StringFormat = never,
>(
  constraints?: StringConstraints<T, readonly [...T2], Format>,
): Schema<
  Decoder<unknown, never, GetTypeFromStringConstraints<T, readonly [...T2], Format>>,
  Constructor<
    GetTypeFromStringConstraints<T, readonly [...T2], Format>,
    never,
    GetTypeFromStringConstraints<T, readonly [...T2], Format>
  >,
  Encoder<
    GetTypeFromStringConstraints<T, readonly [...T2], Format>,
    GetTypeFromStringConstraints<T, readonly [...T2], Format>
  >,
  JsonSchema<GetTypeFromStringConstraints<T, readonly [...T2], Format>>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  readonly []
> {
  return pipe(
    identity(stringRefinementFromConstraints(constraints)),
    arbitrary((fc) => stringArbitraryFromConstraints(fc, constraints)),
    jsonSchema((j) => j.string(constraints)),
  )
}

export function stringRefinementFromConstraints<
  T extends string = never,
  T2 extends ReadonlyArray<string> = never,
  Format extends StringFormat = never,
>(
  constraints?: StringConstraints<T, T2, Format>,
): Refinement<unknown, GetTypeFromStringConstraints<T, T2, Format>> {
  return (u): u is GetTypeFromStringConstraints<T, T2, Format> => {
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
    // TODO: Test Formats of the string?

    return validPattern && u.length >= minLength && u.length <= maxLength
  }
}

export function stringArbitraryFromConstraints<
  T extends string = never,
  T2 extends ReadonlyArray<string> = never,
  Format extends StringFormat = never,
>(
  fc: typeof import('fast-check'),
  constraints?: StringConstraints<T, T2, Format>,
): import('fast-check').Arbitrary<GetTypeFromStringConstraints<T, T2, Format>> {
  type R = import('fast-check').Arbitrary<GetTypeFromStringConstraints<T, T2, Format>>

  if (!constraints) {
    return fc.string() as R
  }

  if (constraints.const) {
    return fc.constant(constraints.const) as R
  }

  if (constraints.enum) {
    return fc.oneof(...constraints.enum.map(fc.constant)) as R
  }

  const fcConstraints: import('fast-check').StringSharedConstraints = {
    minLength: constraints.minLength,
    maxLength: constraints.maxLength,
  }
  // TODO: Test Formats of the string?
  const arb = fc.string(fcConstraints) as R

  if (constraints.pattern) {
    const regexp = constraints.pattern

    return arb.filter(throwOnPoorSuccessRate(`String.pattern`, (s) => regexp.test(s)))
  }

  return arb
}
