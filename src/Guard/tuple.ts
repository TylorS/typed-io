import { AnyGuard, Guard, GuardHKT, OutputOf } from './Guard'
import { isUnknownArray } from './array'
import { guardSharedConstraints } from './shared'

import { OmitJsonSchemaOnly } from '@/Constraints/shared'
import * as CT from '@/Constraints/tuple'

export interface TupleConstraints<A extends ReadonlyArray<any>>
  extends OmitJsonSchemaOnly<CT.TupleConstraints<GuardHKT, A>> {}

export const tuple = <Members extends ReadonlyArray<AnyGuard>>(
  members: Members,
  constraints?: TupleConstraints<{ readonly [K in keyof Members]: OutputOf<Members[K]> }>,
): Guard<{ readonly [K in keyof Members]: OutputOf<Members[K]> }> => ({
  is: guardSharedConstraints(
    isUnknownArray,
    constraints,
    (x): x is { readonly [K in keyof Members]: OutputOf<Members[K]> } =>
      x.length === members.length && x.every((y, i) => members[i].is(y)),
  ),
})
