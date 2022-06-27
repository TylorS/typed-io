import { constTrue } from 'hkt-ts'

import { Arbitrary, ArbitraryHKT } from './Arbitrary'
import { throwOnPoorSuccessRate } from './throwOnPoorSuccessRate'

import * as SC from '@/Constraints/shared'

export interface SharedConstraints<
  Const = never,
  Enum extends ReadonlyArray<any> = never,
  Default = never,
> extends SC.OmitJsonSchemaOnly<SC.SharedConstraints<ArbitraryHKT, Const, Enum, Default>> {}

export const sharedArbitrary = <
  A,
  Const extends A = never,
  Enum extends ReadonlyArray<A> = never,
  Default extends A = never,
  B extends A = A,
>(
  base: Arbitrary<A>['arbitrary'],
  constraints?: SharedConstraints<Const, Enum, Default>,
  refine: (a: A) => a is B = constTrue as any,
  refinmentName: string = refine.name,
): Arbitrary<SC.GetSharedType<Const, Enum, B | Default>> => {
  type R = Arbitrary<SC.GetSharedType<Const, Enum, B | Default>>

  if (!constraints) {
    return Arbitrary((fc) => base(fc).filter(throwOnPoorSuccessRate(refinmentName, refine))) as R
  }

  if ('const' in constraints) {
    return Arbitrary((fc) => fc.constant(constraints.const)) as R
  }

  if (constraints.enum) {
    const enum_ = constraints.enum

    return Arbitrary((fc) => fc.constantFrom(...enum_)) as R
  }

  return Arbitrary((fc) => base(fc).filter(throwOnPoorSuccessRate(refinmentName, refine))) as R
}
