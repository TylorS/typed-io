import { isBoolean } from 'hkt-ts/boolean'

import { Guard, GuardHKT } from './Guard'
import { guardSharedConstraints } from './shared'

import { GetSharedType, OmitJsonSchemaOnly, SharedConstraints } from '@/Constraints/shared'

export interface BooleanConstraints<
  Const extends boolean = never,
  Enum extends ReadonlyArray<boolean> = never,
> extends OmitJsonSchemaOnly<SharedConstraints<GuardHKT, Const, Enum, never>> {}

export const boolean = <Const extends boolean = never, Enum extends ReadonlyArray<boolean> = never>(
  constraints?: BooleanConstraints<Const, Enum>,
): Guard<GetSharedType<Const, Enum, boolean>> => ({
  is: guardSharedConstraints(isBoolean, constraints),
})

const true_ = boolean({ const: true })
const false_ = boolean({ const: false })

export { true_ as true, false_ as false }
