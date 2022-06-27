import { Maybe } from 'hkt-ts/Maybe'

import { Guard, GuardHKT } from './Guard'
import { string } from './string'
import { struct } from './struct'
import { sum } from './sum'

import { SharedConstraints } from '@/Constraints/shared'
import { prop } from '@/Schema'

export const maybe = <A>(
  value: Guard<A>,
  constraints?: SharedConstraints<GuardHKT, Maybe<A>>,
): Guard<Maybe<A>> =>
  sum<Maybe<A>>(constraints)('tag')({
    Nothing: struct({
      tag: prop(string({ const: 'Nothing' })),
    }),
    Just: struct({
      tag: prop(string({ const: 'Just' })),
      value: prop(value),
    }),
  })
