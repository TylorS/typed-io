import * as R from 'hkt-ts/Refinement'
import { Stringify } from 'hkt-ts/Typeclass/Debug'
import { DeepEquals } from 'hkt-ts/Typeclass/Eq'
import { constTrue, pipe } from 'hkt-ts/function'

import { identity } from './identity'

import { arbitrary } from '@/Arbitrary/index'
import { debug } from '@/Debug/index'
import { equals } from '@/Eq/index'
import { jsonSchema } from '@/JsonSchema/SchemaJsonSchema'

export const anything = (constraints?: import('fast-check').ObjectConstraints) =>
  pipe(
    identity(constTrue as R.Refinement<unknown, unknown>),
    equals(DeepEquals.equals),
    debug(Stringify.debug as (u: unknown) => string),
    arbitrary((fc) => (constraints ? fc.anything(constraints) : fc.anything())),
    jsonSchema((j) => j.unknown),
  )

export { anything as unknown }
