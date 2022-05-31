import { Right } from 'hkt-ts/These'
import * as B from 'hkt-ts/boolean'
import { pipe } from 'hkt-ts/function'

import { identity } from './identity'
import { refine } from './refine'

import { arbitrary } from '@/Arbitrary/index'
import { construct } from '@/Constructor/index'
import { debug } from '@/Debug/index'
import { encode } from '@/Encoder/index'
import { equals } from '@/Eq/index'
import { jsonSchema } from '@/JsonSchema/index'

const commonBool_ = pipe(identity<boolean>(B.isBoolean), equals(B.Eq.equals), debug(B.Debug.debug))

export const boolean = pipe(
  commonBool_,
  arbitrary<boolean>((fc) => fc.boolean()),
  jsonSchema((j) => j.boolean),
)

const true_ = pipe(
  commonBool_,
  refine<boolean, true>((x): x is true => x === true),
  arbitrary<true>((fc) => fc.constant(true)),
  encode((t: true) => t),
  construct((t: true) => Right(t)),
  jsonSchema((j) => j.true),
)

const false_ = pipe(
  commonBool_,
  refine<boolean, false>((x): x is false => x === false),
  arbitrary<false>((fc) => fc.constant(false)),
  construct((f: false) => Right(f)),
  encode((f: false) => f),
  jsonSchema((j) => j.false),
)

export { true_ as true, false_ as false }
