import { isNumber } from 'hkt-ts/number'

import { Decoder, DecoderHKT } from './Decoder'
import { decodeSharedConstraints } from './shared'

import * as NC from '@/Constraints/number'
import { GetSharedError, GetSharedType, OmitJsonSchemaOnly } from '@/Constraints/shared'
import {
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

export type NumberErrors<
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
> = GetSharedError<
  NumberError | PositiveInfinityError | NegativeInfinityError | NaNError,
  Const,
  Enum
>

export const number = <
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
  Default extends number = never,
>(
  constraints?: NumberConstraints<Const, Enum, Default>,
): Decoder<unknown, NumberErrors<Const, Enum>, GetSharedType<Const, Enum, number | Default>> =>
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
