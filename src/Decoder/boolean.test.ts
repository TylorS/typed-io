import { deepStrictEqual } from 'assert'

import { pipe } from 'hkt-ts'
import * as L from 'hkt-ts/Law'
import { Left, Right } from 'hkt-ts/These'
import { DeepEquals } from 'hkt-ts/Typeclass/Eq'

import { boolean } from './boolean'

import { BooleanError, ConstError } from '@/SchemaError/BuiltinErrors'

describe(__filename, () => {
  describe('without constraints', () => {
    const decoder = boolean()

    describe('given boolean', () => {
      it('returns Right<boolean>', () =>
        pipe(
          L.boolean,
          L.toProperty((x) => DeepEquals.equals(decoder.decode(x), Right(x))),
          L.assert,
        ))
    })

    describe('given any other value', () => {
      it('returns Left<BooleanError>', () => {
        pipe(
          L.Arbitrary((fc) => fc.anything().filter((x) => typeof x !== 'boolean')),
          L.toProperty((x) => DeepEquals.equals(decoder.decode(x), Left(BooleanError.leaf(x)))),
          L.assert,
        )
      })
    })
  })

  describe('with const constraint', () => {
    const value = true
    const decoder = boolean({ const: value })

    describe('given const value', () => {
      it(`returns Right<${value}>`, () => deepStrictEqual(decoder.decode(value), Right(value)))
    })

    describe('given any other value', () => {
      it(`returns Left<ConstError<${value}, boolean>>`, () => {
        pipe(
          L.Arbitrary((fc) => fc.anything().filter((x) => x !== value)),
          L.toProperty((x) =>
            DeepEquals.equals(decoder.decode(x), Left(ConstError.leaf(value, x))),
          ),
          L.assert,
        )
      })
    })
  })

  describe('with enum constraint', () => {
    const value = true
    const decoder = boolean({ enum: [value] })

    describe('given enum value', () => {
      it(`returns Right<${value}>`, () => deepStrictEqual(decoder.decode(value), Right(value)))
    })

    describe('given any other value', () => {
      it(`returns Left<ConstError<${value}, boolean>>`, () => {
        pipe(
          L.Arbitrary((fc) => fc.anything().filter((x) => x !== value)),
          L.toProperty((x) =>
            DeepEquals.equals(decoder.decode(x), Left(ConstError.leaf(value, x))),
          ),
          L.assert,
        )
      })
    })
  })

  describe('with default constraint', () => {
    const value = true
    const decoder = boolean({ default: value })

    describe('given boolean', () => {
      it('returns input boolean', () =>
        pipe(
          L.boolean,
          L.toProperty((b) => DeepEquals.equals(decoder.decode(b), Right(b))),
          L.assert,
        ))
    })

    describe('given any other value', () => {
      it(`returns fallback value`, () => {
        pipe(
          L.Arbitrary((fc) => fc.anything().filter((x) => typeof x !== 'boolean')),
          L.toProperty((x) => DeepEquals.equals(decoder.decode(x), Right(value))),
          L.assert,
        )
      })
    })
  })
})
