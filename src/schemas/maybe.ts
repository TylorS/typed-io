import { MaybeHKT } from 'hkt-ts/Maybe'
import { pipe } from 'hkt-ts/function'

import { AnySchema, prop } from '@/Schema'
import { ensure } from '@/schemas/core/ensure'
import { struct } from '@/schemas/core/struct'
import { sum } from '@/schemas/core/sum'

export const maybe = <A extends AnySchema>(value: A) =>
  pipe(
    {
      Nothing: struct({}),
      Just: struct({
        value: prop(value),
      }),
    } as const,
    sum('tag'),
    ensure<MaybeHKT, [A]>(),
  )
