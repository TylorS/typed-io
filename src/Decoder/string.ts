import { pipe } from 'hkt-ts'
import { Left } from 'hkt-ts/Either'
import { isNonEmpty } from 'hkt-ts/NonEmptyArray'
import { Right } from 'hkt-ts/These'
import { DeepEquals } from 'hkt-ts/Typeclass/Eq'
import { isString } from 'hkt-ts/string'

import { Decoder, DecoderHKT } from './Decoder'
import { flatMapThese } from './flatMap'
import { decodeSharedConstraints } from './shared'

import { OmitJsonSchemaOnly } from '@/Constraints/shared'
import * as SC from '@/Constraints/string'
import {
  ConstError,
  EnumError,
  FormatError,
  MaxLengthError,
  MinLengthError,
  PatternError,
  StringError,
} from '@/SchemaError/BuiltinErrors'
import { SchemaError, makeSchemaErrorAssociative } from '@/SchemaError/SchemaError'
import { isValidFormat } from '@/refinements/string'

export interface StringConstraints<
  Const extends string = never,
  Enum extends ReadonlyArray<string> = never,
  Format extends SC.StringFormat = never,
> extends OmitJsonSchemaOnly<SC.StringConstraints<DecoderHKT, Const, Enum, Format>> {}

export const string = <
  Const extends string = never,
  Enum extends ReadonlyArray<string> = never,
  Format extends SC.StringFormat = never,
>(
  constraints?: StringConstraints<Const, Enum, Format>,
): Decoder<
  unknown,
  | StringError
  | ConstError<Const>
  | EnumError<Enum>
  | MinLengthError<string>
  | MaxLengthError<string>
  | PatternError
  | FormatError,
  SC.GetTypeFromStringConstraints<Const, Enum, Format>
> =>
  pipe(
    decodeSharedConstraints(isString, StringError.leaf, [], constraints) as Decoder<
      unknown,
      StringError | ConstError<Const> | EnumError<Enum>,
      SC.GetTypeFromStringConstraints<Const, Enum, Format>
    >,
    flatMapThese((s) => {
      // If there or no constraints, or if decodeSharedConstraints returns the default value, avoid additional refinements.
      if (!constraints || DeepEquals.equals(s, constraints.default)) {
        return Right(s)
      }

      const { minLength = 0, maxLength = Infinity, pattern, format } = constraints

      const length = s.length

      const errors: ReadonlyArray<
        SchemaError<MinLengthError<string> | MaxLengthError<string> | PatternError | FormatError>
      > = [
        length >= minLength ? [] : [MinLengthError.leaf(s, minLength, length)],
        length <= maxLength ? [] : [MaxLengthError.leaf(s, maxLength, length)],
        pattern && !pattern.test(s) ? [PatternError.leaf(s, pattern)] : [],
        format && !isValidFormat(s, format) ? [FormatError.leaf(s, format)] : [],
      ].flat()

      return isNonEmpty(errors)
        ? Left(
            errors.reduce(
              makeSchemaErrorAssociative<
                MinLengthError<string> | MaxLengthError<string> | PatternError | FormatError
              >('String Constraints').concat,
            ),
          )
        : Right(s)
    }),
  )
