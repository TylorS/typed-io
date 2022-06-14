import { pipe } from 'hkt-ts'
import { Right } from 'hkt-ts/These'
import { isString } from 'hkt-ts/string'

import { DecoderHKT } from './Decoder'
import { flatMapThese } from './flatMap'
import { decodeSharedConstraints } from './shared'

import { OmitJsonSchemaOnly } from '@/Constraints/shared'
import * as SC from '@/Constraints/string'
import { StringError } from '@/SchemaError/BuiltinErrors'

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
) =>
  pipe(
    decodeSharedConstraints(isString, StringError.leaf, [], constraints),
    flatMapThese((n) => {
      if (!constraints) {
        return Right(n)
      }

      // TODO: Further refine String constraints
      const { minLength, maxLength, pattern, format } = constraints
    }),
  )
