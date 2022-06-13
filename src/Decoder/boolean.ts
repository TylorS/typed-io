import { Right } from 'hkt-ts/Either'
import * as These from 'hkt-ts/These'
import { isBoolean } from 'hkt-ts/boolean'
import { pipe } from 'hkt-ts/function'

import { Decoder, DecoderHKT } from './Decoder'
import { withFallback } from './withFallback'

import { GetSharedType, SharedConstraints } from '@/Constraints/shared'
import { BooleanError, ConstError, EnumError } from '@/SchemaError/BuiltinErrors'
import { SchemaError } from '@/SchemaError/SchemaError'

export interface BooleanConstraints<
  Const extends boolean = never,
  Enum extends ReadonlyArray<boolean> = never,
  Default extends boolean = never,
> extends SharedConstraints<DecoderHKT, Const, Enum, Default> {}

export const boolean = <
  Const extends boolean = never,
  Enum extends ReadonlyArray<boolean> = never,
  Default extends boolean = never,
>(
  constraints?: BooleanConstraints<Const, Enum, Default>,
): Decoder<
  unknown,
  BooleanError | ConstError<Const> | EnumError<Enum>,
  GetSharedType<Const, Enum, boolean>
> => {
  const decode = (
    u: unknown,
  ): These.These<
    SchemaError<BooleanError | ConstError<Const> | EnumError<Enum>>,
    GetSharedType<Const, Enum, boolean>
  > => {
    if (!isBoolean(u)) {
      return These.Left(BooleanError.leaf(u))
    }

    if (!constraints) {
      return Right(u as GetSharedType<Const, Enum, boolean>)
    }

    if (constraints.const !== undefined) {
      return constraints.const === u
        ? Right(u as GetSharedType<Const, Enum, boolean>)
        : These.Left(ConstError.leaf(constraints.const, u))
    }

    if (constraints.enum !== undefined) {
      return constraints.enum.includes(u)
        ? Right(u as GetSharedType<Const, Enum, boolean>)
        : These.Left(EnumError.leaf(constraints.enum, u))
    }

    return Right(u as GetSharedType<Const, Enum, boolean>)
  }

  const fallback = constraints?.default

  if (fallback !== undefined) {
    return pipe(
      {
        decode,
      },
      withFallback(() => fallback as GetSharedType<Const, Enum, boolean>),
    )
  }

  return {
    decode,
  }
}
