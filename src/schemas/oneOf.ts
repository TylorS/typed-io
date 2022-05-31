import { JsonPrimitive } from 'hkt-ts/Json'
import * as R from 'hkt-ts/Refinement'
import { Stringify } from 'hkt-ts/Typeclass/Debug'
import { Strict } from 'hkt-ts/Typeclass/Eq'
import * as B from 'hkt-ts/boolean'
import { pipe } from 'hkt-ts/function'
import * as N from 'hkt-ts/number'
import * as S from 'hkt-ts/string'

import { identity } from './identity'

import { arbitrary } from '@/Arbitrary/index'
import { debug } from '@/Debug/index'
import { equals } from '@/Eq/index'
import { jsonSchema } from '@/JsonSchema/SchemaJsonSchema'

const isJsonPrimitive: R.Refinement<unknown, JsonPrimitive> = pipe(
  N.isNumber,
  R.or(B.isBoolean),
  R.or(S.isString),
  R.or((u: unknown): u is null => u === null),
)

export const oneOf = <A extends ReadonlyArray<JsonPrimitive>>(...values: A) =>
  pipe(
    identity<A[number]>((u): u is A[number] => isJsonPrimitive(u) && values.includes(u)),
    equals<A[number]>(Strict.equals),
    debug<A[number]>(Stringify.debug),
    arbitrary<A[number]>((fc) => fc.constantFrom(...values)),
    jsonSchema<A[number]>((j) =>
      j.JsonSchema<A[number]>({
        type: values.map((value) => typeof value as 'string' | 'number' | 'boolean' | 'null'),
        enum: [...values],
      }),
    ),
  )
