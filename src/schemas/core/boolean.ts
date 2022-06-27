import { SharedConstraints } from '@/Constraints/shared'
import { Schema, SchemaHKT } from '@/Schema'

export interface BooleanConstraints<
  Const extends boolean = never,
  Enum extends ReadonlyArray<boolean> = never,
> extends SharedConstraints<SchemaHKT, Const, Enum, never> {}

export interface BooleanCapabilities<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Const extends boolean = never,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Enum extends ReadonlyArray<boolean> = never,
> {}

export class BooleanSchema<
  Const extends boolean = never,
  Enum extends ReadonlyArray<boolean> = never,
> extends Schema<BooleanCapabilities<Const, Enum>, never, readonly []> {
  static type = '@typed/io/Boolean' as const
  readonly type = BooleanSchema.type
  readonly api!: never

  constructor(readonly constraints?: BooleanConstraints<Const, Enum>) {
    super()
  }
}

export const boolean = <Const extends boolean = never, Enum extends ReadonlyArray<boolean> = never>(
  constraints?: BooleanConstraints<Const, Enum>,
): Schema<BooleanCapabilities<Const, Enum>, never, readonly []> => new BooleanSchema(constraints)
