import { identity } from './core/identity'

import { SharedConstraints } from '@/JsonSchema/JsonSchema'
import { isBoolean } from '@/refinements/boolean'

export const boolean = <Const extends boolean = never, Enum extends readonly boolean[] = never>(
  constraints?: SharedConstraints<Const, Enum>,
) => identity(isBoolean(constraints))
