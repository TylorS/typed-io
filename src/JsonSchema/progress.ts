import { Progress } from 'hkt-ts/Progress'

import { JsonSchema } from './JsonSchema'
import { maybe } from './maybe'
import { number } from './number'
import { struct } from './struct'

import { prop } from '@/Schema'

export const progress = (
  loaded: JsonSchema<number> = number(),
  total: JsonSchema<number> = number(),
): JsonSchema<Progress> =>
  struct({
    loaded: prop(loaded),
    total: prop(maybe(total)),
  })
