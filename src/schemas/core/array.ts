import * as CA from '@/Constraints/array'
import type { GuardOutputOf } from '@/Guard/GuardSchema'
import { AnyAnnotations, AnyCapabilities, Schema, SchemaHKT } from '@/Schema'
import { Compact } from '@/internal'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ArrayCapabilities<C extends AnyCapabilities> {}

export class ArraySchema<
  C extends AnyCapabilities,
  Api,
  Annotations extends AnyAnnotations,
> extends Schema<
  ArrayCapabilities<C>,
  {
    readonly member: Schema<C, Api, Annotations>
  },
  Annotations
> {
  static type = '@typed/io/Array' as const
  readonly type = ArraySchema.type

  get api() {
    return {
      member: this.member,
    }
  }

  constructor(
    readonly member: Schema<C, Api, Annotations>,
    readonly constraints?: CA.ArrayConstraints<SchemaHKT, GuardOutputOf<C>>,
  ) {
    super()
  }
}

export const array = <C extends AnyCapabilities, Api, Annotations extends AnyAnnotations>(
  member: Schema<C, Api, Annotations>,
  // TODO: What's the best way to extract values out of Schemas when interpreters are external?
  constraints?: CA.ArrayConstraints<SchemaHKT, GuardOutputOf<C>>,
): Schema<
  Compact<ArrayCapabilities<C>>,
  {
    readonly member: Schema<C, Api, Annotations>
  },
  Annotations
> => new ArraySchema(member, constraints)
