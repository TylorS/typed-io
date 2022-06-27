import { Integer } from 'hkt-ts/number'

import * as N from '@/Constraints/integer'
import { Schema, SchemaHKT } from '@/Schema'

export interface IntegerConstraints<
  Const extends Integer = never,
  Enum extends ReadonlyArray<Integer> = never,
  Default extends Integer = never,
> extends N.IntegerConstraints<SchemaHKT, Const, Enum, Default> {}

export interface IntegerCapabilities<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Const extends Integer = never,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Enum extends ReadonlyArray<Integer> = never,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Default extends Integer = never,
> {}

export class IntegerSchema<
  Const extends Integer = never,
  Enum extends ReadonlyArray<Integer> = never,
  Default extends Integer = never,
> extends Schema<IntegerCapabilities<Const, Enum, Default>, never, readonly []> {
  static type = '@typed/io/Boolean' as const
  readonly type = IntegerSchema.type
  readonly api!: never

  constructor(readonly constraints?: IntegerConstraints<Const, Enum, Default>) {
    super()
  }
}

export const integer = <
  Const extends Integer = never,
  Enum extends ReadonlyArray<Integer> = never,
  Default extends Integer = never,
>(
  constraints?: IntegerConstraints<Const, Enum, Default>,
): Schema<IntegerCapabilities<Const, Enum, Default>, never, readonly []> =>
  new IntegerSchema(constraints)
