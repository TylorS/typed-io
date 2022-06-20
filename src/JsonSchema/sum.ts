import { JsonSchema, JsonSchemaHKT } from './JsonSchema'

import { SharedConstraints } from '@/Constraints/shared'

export const sum =
  <T extends Readonly<Record<PropertyKey, any>>>(
    constraints?: SharedConstraints<JsonSchemaHKT, T>,
  ) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <Tag extends keyof T>(_tag: Tag) =>
  (schemas: SumSchemas<T, Tag>) =>
    JsonSchema<T>({
      oneOf: Object.values(schemas),
      ...constraints,
    })

export type SumSchemas<T, Tag extends keyof T> = {
  readonly [K in T[Tag] & PropertyKey]: FindSumSchema<T, Tag, K>
}

export type FindSumSchema<T, Tag extends keyof T, K extends T[Tag]> = T extends {
  readonly [_ in Tag]: K
}
  ? JsonSchema<T>
  : never
