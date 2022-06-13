import { identity } from './core/identity'

import { NumberConstraints } from '@/JsonSchema/JsonSchema'
import { isNumber } from '@/refinements/number'

export const number = <Const extends number = never, Enum extends readonly number[] = never>(
  constraints?: NumberConstraints<Const, Enum>,
) => identity(isNumber(constraints))
