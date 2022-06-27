import { HKT } from 'hkt-ts'

import { SharedConstraints } from './shared'

export interface ArrayConstraints<T extends HKT, A>
  extends SharedConstraints<T, ReadonlyArray<A>, ReadonlyArray<ReadonlyArray<A>>> {
  readonly minContains?: number
  readonly maxContains?: number
  readonly uniqueItems?: boolean
  readonly default?: ReadonlyArray<A>
}
