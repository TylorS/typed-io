import { SharedConstraints } from '@/Constraints/shared'
import { GuardOutputOf } from '@/Guard/GuardSchema'
import { AnySchema, Schema, SchemaHKT } from '@/Schema'
import { TupleAnnotations, TupleApi } from '@/schemas/core/tuple'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface UnionCapabilities<Members extends ReadonlyArray<AnySchema>> {}

export class UnionSchema<
  Members extends ReadonlyArray<AnySchema>,
  Constraints extends SharedConstraints<
    SchemaHKT,
    GuardOutputOf<Members[number]>
  > = SharedConstraints<SchemaHKT, GuardOutputOf<Members[number]>>,
> extends Schema<UnionCapabilities<Members>, TupleApi<Members>, TupleAnnotations<Members>> {
  static type = '@typed/io/Union' as const
  readonly type = UnionSchema.type

  get api() {
    return {
      members: this.members.map((m) => m.api) as unknown as TupleApi<Members>['members'],
    }
  }

  constructor(
    readonly members: Members,
    // TODO: How to better extract output values from Schemas?
    readonly constraints?: Constraints,
  ) {
    super()
  }
}

export const union = <
  Members extends ReadonlyArray<AnySchema>,
  Constraints extends SharedConstraints<
    SchemaHKT,
    GuardOutputOf<Members[number]>
  > = SharedConstraints<SchemaHKT, GuardOutputOf<Members[number]>>,
>(
  members: Members,
  // TODO: How to better extract output values from Schemas?
  constraints?: Constraints,
) => new UnionSchema(members, constraints)
