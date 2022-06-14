import { HKT } from 'hkt-ts'

import { SharedConstraints } from './shared'

export interface NumberConstraints<
  T extends HKT,
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
  Default extends number = never,
> extends SharedConstraints<T, Const, Enum, Default> {
  readonly minimum?: number
  readonly maximum?: number
  readonly multipleOf?: number
  readonly exclusiveMaximum?: number
  readonly exclusiveMinimum?: number
}
