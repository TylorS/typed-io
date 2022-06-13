import { identity } from './core/identity'

import { StringConstraints, StringFormat } from '@/JsonSchema/JsonSchema'
import { isString } from '@/refinements/string'

export const string = <
  Const extends string = never,
  Enum extends readonly string[] = never,
  Format extends StringFormat = never,
>(
  constraints?: StringConstraints<Const, Enum, Format>,
) => identity(isString(constraints))
