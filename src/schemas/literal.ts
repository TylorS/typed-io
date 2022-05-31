import { JsonPrimitive } from 'hkt-ts/Json'
import { Stringify } from 'hkt-ts/Typeclass/Debug'
import { Strict } from 'hkt-ts/Typeclass/Eq'
import { pipe } from 'hkt-ts/function'

import { identity } from './identity'

import { arbitrary } from '@/Arbitrary/index'
import { debug } from '@/Debug/index'
import { equals } from '@/Eq/index'
import { jsonSchema } from '@/JsonSchema/SchemaJsonSchema'

export const literal = <A extends JsonPrimitive>(value: A) =>
  pipe(
    identity<A>((u): u is A => u === value),
    equals<A>(Strict.equals),
    debug<A>(Stringify.debug),
    arbitrary<A>((fc) => fc.constant(value)),
    jsonSchema<A>((j) =>
      j.JsonSchema<A>({
        type: typeof value as 'string' | 'number' | 'boolean' | 'null',
        enum: [value],
      }),
    ),
  )
