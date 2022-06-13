import { HKT, Kind_ } from 'hkt-ts/HKT'
import { ReadonlyRecord } from 'hkt-ts/Record'

import { SharedConstraints } from './shared'

export interface RecordConstraints<T extends HKT, K extends string, A>
  extends SharedConstraints<T, ReadonlyRecord<K, A>> {
  readonly maxProperties?: number
  readonly minProperties?: number
  readonly patternProperties?: ReadonlyRecord<string, Kind_<[T], [A]>>
  readonly required?: readonly K[]
  readonly default?: ReadonlyRecord<K, A>
}