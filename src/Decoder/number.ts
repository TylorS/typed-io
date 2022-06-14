import { isNumber } from 'hkt-ts/number'

import { Decoder, DecoderHKT } from './Decoder'
import { decodeSharedConstraints } from './shared'

import * as NC from '@/Constraints/number'
import { GetSharedType, OmitJsonSchemaOnly } from '@/Constraints/shared'
import {
  ConstError,
  EnumError,
  NaNError,
  NegativeInfinityError,
  NumberError,
  PositiveInfinityError,
} from '@/SchemaError/BuiltinErrors'

export interface NumberConstraints<
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
  Default extends number = never,
> extends OmitJsonSchemaOnly<NC.NumberConstraints<DecoderHKT, Const, Enum, Default>> {}

export const number = <
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
  Default extends number = never,
>(
  constraints?: NumberConstraints<Const, Enum, Default>,
): Decoder<
  unknown,
  | NumberError
  | PositiveInfinityError
  | NegativeInfinityError
  | NaNError
  | ConstError<Const>
  | EnumError<Enum>,
  GetSharedType<Const, Enum, number | Default>
> =>
  decodeSharedConstraints(
    isNumber,
    NumberError.leaf,
    [
      [(x: number): x is number => x !== Infinity, PositiveInfinityError.leaf],
      [(x: number): x is number => x !== -Infinity, NegativeInfinityError.leaf],
      [(x: number): x is number => !Number.isNaN(x), NaNError.leaf],
    ],
    constraints,
  )
