import { pipe } from 'hkt-ts'
import { compose } from 'hkt-ts/Refinement'
import { Integer, isInteger, isNumber } from 'hkt-ts/number'

import { Decoder, DecoderHKT } from './Decoder'
import { decodeSharedConstraints } from './shared'

import * as NC from '@/Constraints/integer'
import { GetSharedType, OmitJsonSchemaOnly } from '@/Constraints/shared'
import {
  ConstError,
  EnumError,
  IntegerError,
  NaNError,
  NegativeInfinityError,
  PositiveInfinityError,
} from '@/SchemaError/BuiltinErrors'

export interface IntegerConstraints<
  Const extends Integer = never,
  Enum extends ReadonlyArray<Integer> = never,
  Default extends Integer = never,
> extends OmitJsonSchemaOnly<NC.IntegerConstraints<DecoderHKT, Const, Enum, Default>> {}

export const integer = <
  Const extends Integer = never,
  Enum extends ReadonlyArray<Integer> = never,
  Default extends Integer = never,
>(
  constraints?: IntegerConstraints<Const, Enum, Default>,
): Decoder<
  unknown,
  | IntegerError
  | PositiveInfinityError
  | NegativeInfinityError
  | NaNError
  | ConstError<Const>
  | EnumError<Enum>,
  GetSharedType<Const, Enum, Integer | Default>
> =>
  decodeSharedConstraints(
    pipe(isNumber, compose(isInteger)),
    IntegerError.leaf,
    [
      [(x: Integer): x is Integer => x !== Infinity, PositiveInfinityError.leaf],
      [(x: Integer): x is Integer => x !== -Infinity, NegativeInfinityError.leaf],
      [(x: Integer): x is Integer => !Number.isNaN(x), NaNError.leaf],
    ],
    constraints,
  )
