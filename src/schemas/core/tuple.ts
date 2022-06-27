import * as CT from '@/Constraints/tuple'
import { GuardOutputOf } from '@/Guard/GuardSchema'
import { AnnotationsOf, AnySchema, Schema, SchemaHKT } from '@/Schema'
import { Compact } from '@/internal'

export interface TupleConstraints<A extends ReadonlyArray<any>>
  extends CT.TupleConstraints<SchemaHKT, A> {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TupleCapabilities<Members extends ReadonlyArray<AnySchema>> {}

export type TupleApi<Members extends ReadonlyArray<AnySchema>> = {
  readonly members: Members
}

export type TupleAnnotations<
  Members extends ReadonlyArray<any>,
  R extends ReadonlyArray<any> = [],
> = Members extends readonly [infer Head, ...infer Tail]
  ? TupleAnnotations<Tail, Head extends AnySchema ? [...R, ...AnnotationsOf<Head>] : R>
  : R

export class TupleSchema<Members extends ReadonlyArray<AnySchema>> extends Schema<
  TupleCapabilities<Members>,
  TupleApi<Members>,
  TupleAnnotations<Members>
> {
  static type = '@typed/io/Tuple' as const
  readonly type = TupleSchema.type

  get api() {
    return {
      members: this.members,
    }
  }

  constructor(
    readonly members: Members,
    // TODO: How to better extract output values from Schemas?
    readonly constraints?: TupleConstraints<{
      readonly [K in keyof Members]: GuardOutputOf<Members[K]>
    }>,
  ) {
    super()
  }
}

export const tuple = <Members extends ReadonlyArray<AnySchema>>(
  members: Members,
  // TODO: How to better extract output values from Schemas?
  constraints?: TupleConstraints<{
    readonly [K in keyof Members]: GuardOutputOf<Members[K]>
  }>,
): Schema<
  Compact<TupleCapabilities<Members>>,
  Compact<TupleApi<Members>>,
  TupleAnnotations<Members>
> => new TupleSchema(members, constraints)
