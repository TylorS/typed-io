import { isString } from 'hkt-ts/string'

import { Guard, GuardHKT } from './Guard'
import { guardSharedConstraints } from './shared'

import { OmitJsonSchemaOnly } from '@/Constraints/shared'
import * as SC from '@/Constraints/string'
import { isValidFormat } from '@/refinements/string'

export interface StringConstraints<
  Const extends string = never,
  Enum extends readonly string[] = never,
  Format extends SC.StringFormat = never,
> extends OmitJsonSchemaOnly<SC.StringConstraints<GuardHKT, Const, Enum, Format>> {}

export const string = <
  Const extends string = never,
  Enum extends readonly string[] = never,
  Format extends SC.StringFormat = never,
>(
  constraints?: StringConstraints<Const, Enum, Format>,
): Guard<SC.GetTypeFromStringConstraints<Const, Enum, Format>> => ({
  is: guardSharedConstraints(
    isString,
    constraints,
    (x): x is SC.GetTypeFromStringConstraints<Const, Enum, Format> => {
      const { minLength = 0, maxLength = Infinity } = constraints ?? {}

      if (minLength > x.length || maxLength < x.length) {
        return false
      }

      if (constraints?.pattern && !constraints.pattern.test(x)) {
        return false
      }

      if (constraints?.format) {
        return isValidFormat(x, constraints.format)
      }

      return true
    },
  ) as Guard<SC.GetTypeFromStringConstraints<Const, Enum, Format>>['is'],
})
