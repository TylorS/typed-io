import * as N from '@/Constraints/number'
import { Schema, SchemaHKT } from '@/Schema'

export interface NumberConstraints<
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
  Default extends number = never,
> extends N.NumberConstraints<SchemaHKT, Const, Enum, Default> {}

export interface NumberCapabilities<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Const extends number = never,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Enum extends ReadonlyArray<number> = never,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Default extends number = never,
> {}

export class NumberSchema<
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
  Default extends number = never,
> extends Schema<NumberCapabilities<Const, Enum, Default>, never, readonly []> {
  static type = '@typed/io/Boolean' as const
  readonly type = NumberSchema.type
  readonly api!: never

  constructor(readonly constraints?: NumberConstraints<Const, Enum, Default>) {
    super()
  }
}

export const number = <
  Const extends number = never,
  Enum extends ReadonlyArray<number> = never,
  Default extends number = never,
>(
  constraints?: NumberConstraints<Const, Enum, Default>,
): Schema<NumberCapabilities<Const, Enum, Default>, never, readonly []> =>
  new NumberSchema(constraints)
