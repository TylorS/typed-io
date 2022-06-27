import { DataEither } from 'hkt-ts/DataEither'

import { Guard, GuardHKT } from './Guard'
import { data } from './data'
import { either } from './either'

import { SharedConstraints } from '@/Constraints/shared'

export const dataEither = <E, A>(
  E: Guard<E>,
  A: Guard<A>,
  constraints?: SharedConstraints<GuardHKT, DataEither<E, A>>,
): Guard<DataEither<E, A>> => data(either(E, A), constraints)
