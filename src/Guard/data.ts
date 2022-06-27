import { Data } from 'hkt-ts/Data'
import { Progress } from 'hkt-ts/Progress'
import { NonNegativeFloat } from 'hkt-ts/number'

import { Guard, GuardHKT } from './Guard'
import { branded } from './branded'
import { maybe } from './maybe'
import { number } from './number'
import { string } from './string'
import { struct } from './struct'
import { sum } from './sum'

import { SharedConstraints } from '@/Constraints/shared'
import { prop } from '@/Schema'

const nonNegativeFloat = branded<NonNegativeFloat>()(number())

export const progress = (
  loaded: Guard<NonNegativeFloat> = nonNegativeFloat,
  total: Guard<NonNegativeFloat> = nonNegativeFloat,
): Guard<Progress> =>
  struct({
    loaded: prop(loaded),
    total: prop(maybe(total)),
  })

export const data = <A>(
  value: Guard<A>,
  constraints?: SharedConstraints<GuardHKT, Data<A>>,
): Guard<Data<A>> =>
  sum<Data<A>>(constraints)('tag')({
    NoData: struct({
      tag: prop(string({ const: 'NoData' })),
    }),
    Pending: struct({
      tag: prop(string({ const: 'Pending' })),
      progress: prop(maybe(progress())),
    }),
    Refreshing: struct({
      tag: prop(string({ const: 'Refreshing' })),
      value: prop(value),
      progress: prop(maybe(progress())),
    }),
    Replete: struct({
      tag: prop(string({ const: 'Replete' })),
      value: prop(value),
    }),
  })
