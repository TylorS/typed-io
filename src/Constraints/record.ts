import { HKT } from 'hkt-ts/HKT'
import { ReadonlyRecord } from 'hkt-ts/Record'

import { ConstrainA, SharedConstraints } from './shared'

export interface RecordConstraints<T extends HKT, K extends string, A>
  extends SharedConstraints<T, ReadonlyRecord<K, A>> {
  readonly maxProperties?: number
  readonly minProperties?: number
  readonly patternProperties?: ReadonlyRecord<string, ConstrainA<T, A>>
  readonly required?: readonly K[]
  readonly default?: ReadonlyRecord<K, A>
}
