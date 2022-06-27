import { Arbitrary } from './Arbitrary'
import { SharedConstraints, sharedArbitrary } from './shared'

import { GetSharedType } from '@/Constraints/shared'

export interface BooleanConstraints<
  Const extends boolean = never,
  Enum extends ReadonlyArray<boolean> = never,
> extends SharedConstraints<Const, Enum, never> {}

export const boolean = <Const extends boolean = never, Enum extends ReadonlyArray<boolean> = never>(
  constraints?: BooleanConstraints<Const, Enum>,
): Arbitrary<GetSharedType<Const, Enum, boolean>> =>
  sharedArbitrary((fc) => fc.boolean(), constraints)
