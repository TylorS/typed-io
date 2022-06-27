import { DataHKT } from 'hkt-ts/Data'
import { Progress } from 'hkt-ts/Progress'
import { pipe } from 'hkt-ts/function'
import { NonNegativeFloat } from 'hkt-ts/number'

import { maybe } from './maybe'

import { AnySchema, prop } from '@/Schema'
import { brand } from '@/schemas/core/branded'
import { ensure } from '@/schemas/core/ensure'
import { number } from '@/schemas/core/number'
import { struct } from '@/schemas/core/struct'
import { sum } from '@/schemas/core/sum'

export { FLOAT, NON_NEGATIVE } from 'hkt-ts/number'

export const progress = pipe(
  struct({
    loaded: pipe(number(), brand<NonNegativeFloat>(), prop),
    total: pipe(number(), brand<NonNegativeFloat>(), maybe, prop),
  }),
  ensure<Progress>(),
)

export const data = <A extends AnySchema>(value: A) =>
  pipe(
    {
      NoData: struct({}),
      Pending: struct({
        progress: prop(maybe(progress)),
      }),
      Refreshing: struct({
        value: prop(value),
        progress: prop(maybe(progress)),
      }),
      Replete: struct({
        value: prop(value),
      }),
    } as const,
    sum('tag'),
    ensure<DataHKT, readonly [A]>(),
  )
