import { pipe } from 'hkt-ts/function'

import { AnySchema, prop } from '@/Schema'
import { struct } from '@/schemas/core/struct'
import { sum } from '@/schemas/core/sum'

export const either = <E extends AnySchema, A extends AnySchema>(left: E, right: A) =>
  pipe(
    {
      Left: struct({
        left: prop(left),
      }),
      Right: struct({
        right: prop(right),
      }),
    } as const,
    sum('tag'),
  )
