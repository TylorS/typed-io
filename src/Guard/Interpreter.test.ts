import { ok } from 'assert'

import { Refinement, constTrue, pipe } from 'hkt-ts'
import { isNumber } from 'hkt-ts/number'
import { isString } from 'hkt-ts/string'

import { toGuard } from './Interpreter'
import { guard } from './SchemaGuard'

import { refine } from '@/index'
import { identity } from '@/schemas/identity'
import { string } from '@/schemas/string'

describe(__filename, () => {
  describe('toGuard', () => {
    describe(identity.name, () => {
      it('creates a guard from an identity Schema', () => {
        const schemaNumber = identity(isNumber)
        const schemaString = identity(isString)
        const guardNumber = toGuard(schemaNumber)
        const guardString = toGuard(schemaString)

        ok(guardNumber.is(1))
        ok(guardNumber.is(42))
        ok(!guardNumber.is('foobar'))
        ok(!guardNumber.is(null))
        ok(!guardNumber.is(undefined))

        ok(guardString.is('foobar'))
        ok(guardString.is(''))
        ok(!guardString.is(null))
        ok(!guardString.is(undefined))
        ok(!guardString.is(42))
      })
    })

    describe(guard.name, () => {
      it('uses the provided guard', () => {
        const schema = pipe(string(), guard(constTrue as Refinement.Refinement<unknown, string>))

        ok(toGuard(schema).is('foobar'))
        ok(toGuard(schema).is(true))
      })
    })

    describe(refine.name, () => {
      it('refines the guard', () => {
        const { is } = pipe(
          string(),
          refine((s): s is string => s.length > 2),
          toGuard,
        )

        ok(is('foo'))
        ok(!is('x'))
      })
    })
  })
})
