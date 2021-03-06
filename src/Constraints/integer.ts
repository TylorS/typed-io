import { HKT } from 'hkt-ts'
import { Integer } from 'hkt-ts/number'

import { SharedConstraints } from './shared'

export interface IntegerConstraints<
  T extends HKT,
  Const extends Integer = never,
  Enum extends ReadonlyArray<Integer> = never,
  Default extends Integer = never,
> extends SharedConstraints<T, Const, Enum, Default> {
  readonly minimum?: Integer
  readonly maximum?: Integer
  readonly multipleOf?: Integer
  readonly exclusiveMaximum?: Integer
  readonly exclusiveMinimum?: Integer
}
