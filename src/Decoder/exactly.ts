import { JsonPrimitive } from 'hkt-ts/Json'
import { NonEmptyArray, map } from 'hkt-ts/NonEmptyArray'
import { isBoolean } from 'hkt-ts/boolean'
import { pipe } from 'hkt-ts/function'
import { isNumber } from 'hkt-ts/number'
import { isString } from 'hkt-ts/string'

import { Decoder } from './Decoder'
import { BooleanErrors, boolean } from './boolean'
import { null_ } from './nullable'
import { NumberErrors, number } from './number'
import { string } from './string'
import { union } from './union'

import { GetSharedError } from '@/Constraints/shared'
import { MessageError, StringError } from '@/SchemaError/BuiltinErrors'

export type ExactlyErrors<A extends JsonPrimitive> = A extends string
  ? GetSharedError<StringError, A, never>
  : A extends number
  ? NumberErrors<A, never>
  : A extends boolean
  ? BooleanErrors<A, never>
  : MessageError

export type ExactlyDecoder<A extends JsonPrimitive> = Decoder<unknown, ExactlyErrors<A>, A>

export const exactly = <A extends JsonPrimitive>(value: A): ExactlyDecoder<A> => {
  if (isString(value)) {
    return string({ const: value }) as ExactlyDecoder<A>
  }

  if (isNumber(value)) {
    return number({ const: value }) as ExactlyDecoder<A>
  }

  if (isBoolean(value)) {
    return boolean({ const: value }) as ExactlyDecoder<A>
  }

  return null_ as ExactlyDecoder<A>
}

export const oneOf = <A extends NonEmptyArray<JsonPrimitive>>(
  ...values: A
): ExactlyDecoder<A[number]> => union(...pipe(values, map(exactly))) as ExactlyDecoder<A[number]>
