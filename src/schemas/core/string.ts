import * as S from '@/Constraints/string'
import { Schema, SchemaHKT } from '@/Schema'

export interface StringConstraints<
  Const extends string = never,
  Enum extends ReadonlyArray<string> = never,
  Format extends S.StringFormat = never,
> extends S.StringConstraints<SchemaHKT, Const, Enum, Format> {}

export interface StringCapabilities<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Const extends string = never,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Enum extends ReadonlyArray<string> = never,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Format extends S.StringFormat = never,
> {}

export class StringSchema<
  Const extends string = never,
  Enum extends ReadonlyArray<string> = never,
  Format extends S.StringFormat = never,
> extends Schema<StringCapabilities<Const, Enum, Format>, never, readonly []> {
  static type = '@typed/io/String' as const
  readonly type = StringSchema.type
  readonly api!: never

  constructor(readonly constraints?: StringConstraints<Const, Enum, Format>) {
    super()
  }
}

export const string = <
  Const extends string = never,
  Enum extends ReadonlyArray<string> = never,
  Format extends S.StringFormat = never,
>(
  constraints?: StringConstraints<Const, Enum, Format>,
): Schema<StringCapabilities<Const, Enum, Format>, never, readonly []> =>
  new StringSchema(constraints)
