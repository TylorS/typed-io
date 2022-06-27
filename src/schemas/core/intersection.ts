import { SharedConstraints } from '@/Constraints/shared'
import { GuardOutputOf } from '@/Guard/GuardSchema'
import { AnySchema, Schema, SchemaHKT } from '@/Schema'
import { ToIntersection } from '@/internal'
import { TupleAnnotations, TupleApi } from '@/schemas/core/tuple'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IntersectionCapabilities<Members extends ReadonlyArray<AnySchema>> {}

export class IntersectionSchema<
  Members extends ReadonlyArray<AnySchema>,
  Constraints extends SharedConstraints<
    SchemaHKT,
    ToIntersection<{ readonly [K in keyof Members]: GuardOutputOf<Members[K]> }>
  > = SharedConstraints<
    SchemaHKT,
    ToIntersection<{ readonly [K in keyof Members]: GuardOutputOf<Members[K]> }>
  >,
> extends Schema<IntersectionCapabilities<Members>, TupleApi<Members>, TupleAnnotations<Members>> {
  static type = '@typed/io/Intersection' as const
  readonly type = IntersectionSchema.type

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

export const intersection = <
  Members extends ReadonlyArray<AnySchema>,
  Constraints extends SharedConstraints<
    SchemaHKT,
    ToIntersection<{ readonly [K in keyof Members]: GuardOutputOf<Members[K]> }>
  > = SharedConstraints<
    SchemaHKT,
    ToIntersection<{ readonly [K in keyof Members]: GuardOutputOf<Members[K]> }>
  >,
>(
  members: Members,
  // TODO: How to better extract output values from Schemas?
  constraints?: Constraints,
): Schema<IntersectionCapabilities<Members>, TupleApi<Members>, TupleAnnotations<Members>> =>
  new IntersectionSchema(members, constraints)
