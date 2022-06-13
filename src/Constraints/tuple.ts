import { HKT } from 'hkt-ts'

import { SharedConstraints } from './shared'

export interface TupleConstraints<T extends HKT, A extends ReadonlyArray<any>>
  extends SharedConstraints<T, A> {}
