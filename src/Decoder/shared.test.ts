import { deepStrictEqual, ok } from 'assert'

import { pipe } from 'hkt-ts'
import * as L from 'hkt-ts/Law'
import { Both, Left, Right, These, isLeft } from 'hkt-ts/These'
import { DeepEquals } from 'hkt-ts/Typeclass/Eq'
import { isNumber } from 'hkt-ts/number'

import { decodeSharedConstraints } from './shared'

import {
  ConstError,
  EnumError,
  NaNError,
  NegativeInfinityError,
  NumberError,
  PositiveInfinityError,
  ToRoseTree,
} from '@/SchemaError/BuiltinErrors'
import { printSchemaError } from '@/SchemaError/Debug'
import { NamedError, SchemaError } from '@/SchemaError/SchemaError'

describe(__filename, () => {
  describe('base refinements', () => {
    const { decode } = decodeSharedConstraints(isNumber, NumberError.leaf, [])

    describe('given the refinement returns true', () => {
      it('returns Right with the provided value', () =>
        pipe(
          L.number(),
          L.toProperty((n) => DeepEquals.equals(decode(n), Right(n))),
          L.assert,
        ))
    })

    describe('given the refinement returns false', () => {
      it('returns Left with the provided error', () =>
        pipe(
          L.Arbitrary((fc) => fc.anything().filter((x) => typeof x !== 'number')),
          L.toProperty((n) => DeepEquals.equals(decode(n), Left(NumberError.leaf(n)))),
          L.assert,
        ))
    })
  })

  describe('additional refinements', () => {
    const { decode } = decodeSharedConstraints(isNumber, NumberError.leaf, [
      [(x: number): x is number => x !== Infinity, PositiveInfinityError.leaf],
      [(x: number): x is number => x !== -Infinity, NegativeInfinityError.leaf],
      [(x: number): x is number => !Number.isNaN(x), NaNError.leaf],
    ] as const)

    describe('given a refinement returns false', () => {
      it('returns Left with the provided error', () => {
        const testLefts = <E extends ToRoseTree, A>(
          actual: These<SchemaError<E>, A>,
          expected: SchemaError<E>,
        ) => {
          ok(isLeft(actual))

          deepStrictEqual(printSchemaError(actual.left), printSchemaError(expected))
        }

        testLefts(decode(Infinity), PositiveInfinityError.leaf(Infinity))
        testLefts(decode(-Infinity), NegativeInfinityError.leaf(-Infinity))
        testLefts(decode(NaN), NaNError.leaf(NaN))
      })
    })

    describe('given all refinements return true', () => {
      it('returns Right with the provided value', () => {
        deepStrictEqual(decode(42), Right(42))
      })
    })
  })

  describe('with Const constraint', () => {
    const value = 42
    const { decode } = decodeSharedConstraints(isNumber, NumberError.leaf, [], {
      const: value,
    })

    describe('given the input value matches the const value', () => {
      it('returns Right with the const value', () =>
        pipe(
          L.constant(value),
          L.toProperty((u) => DeepEquals.equals(decode(u), Right(value))),
          L.assert,
        ))
    })

    describe('given the input value does NOT matches the const value', () => {
      it('returns Left with the ConstError', () =>
        pipe(
          L.Arbitrary((fc) => fc.anything().filter((x) => x !== value)),
          L.toProperty((u) => DeepEquals.equals(decode(u), Left(ConstError.leaf(value, u)))),
          L.assert,
        ))
    })
  })

  describe('with Enum constraint', () => {
    const values = [42, 7, 96]
    const { decode } = decodeSharedConstraints(isNumber, NumberError.leaf, [], {
      enum: values,
    })

    describe('given the input value matches the enum values', () => {
      it('returns Right with the matched value', () =>
        pipe(
          L.Arbitrary((fc) => fc.constantFrom(...values)),
          L.toProperty((u) => DeepEquals.equals(decode(u), Right(u))),
          L.assert,
        ))
    })

    describe('given the input value does NOT matches the enum values', () => {
      it('returns Left with EnumError', () =>
        pipe(
          L.Arbitrary((fc) =>
            fc.anything().filter((x) => (typeof x === 'number' ? !values.includes(x) : true)),
          ),
          L.toProperty((u) => DeepEquals.equals(decode(u), Left(EnumError.leaf(values, u)))),
          L.assert,
        ))
    })
  })

  describe('with Default constraint', () => {
    const value = 42
    const { decode } = decodeSharedConstraints(isNumber, NumberError.leaf, [], {
      default: value,
    })

    describe('given the base decoder succeeds', () => {
      it('returns Right with value', () =>
        pipe(
          L.number(),
          L.toProperty((n) => DeepEquals.equals(decode(n), Right(n))),
          L.assert,
        ))
    })

    describe('given the base decoder fails', () => {
      it('returns Both with accumulated errors and the default value', () =>
        pipe(
          L.Arbitrary((fc) => fc.anything().filter((x) => typeof x !== 'number')),
          L.toProperty((n) => DeepEquals.equals(decode(n), Both(NumberError.leaf(n), value))),
          L.assert,
        ))
    })
  })

  describe('with Title constraint', () => {
    const title = 'Example'
    const { decode } = decodeSharedConstraints(isNumber, NumberError.leaf, [], { title })

    it('wraps decoder with a name', () =>
      pipe(
        L.Arbitrary((fc) => fc.anything().filter((x) => typeof x !== 'number')),
        L.toProperty((n) =>
          DeepEquals.equals(decode(n), Left(new NamedError(title, NumberError.leaf(n)))),
        ),
        L.assert,
      ))
  })
})
