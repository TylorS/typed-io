import { Either } from 'hkt-ts/Either'

import { Guard, GuardHKT } from './Guard'
import { string } from './string'
import { struct } from './struct'
import { sum } from './sum'

import { SharedConstraints } from '@/Constraints/shared'
import { prop } from '@/Schema'

export const either = <E, A>(
  left: Guard<E>,
  right: Guard<A>,
  constraints?: SharedConstraints<GuardHKT, Either<E, A>>,
): Guard<Either<E, A>> =>
  sum<Either<E, A>>(constraints)('tag')({
    Left: struct({
      tag: prop(string({ const: 'Left' })),
      left: prop(left),
    }),
    Right: struct({
      tag: prop(string({ const: 'Right' })),
      right: prop(right),
    }),
  })
