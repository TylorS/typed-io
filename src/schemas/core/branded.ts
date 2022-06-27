import { Branded } from 'hkt-ts/Branded'

import { AnyAnnotations, AnyCapabilities, Schema } from '@/Schema'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface BrandedCapabilities<C extends AnyCapabilities, Branded> {}

export class BrandedSchema<
  C extends AnyCapabilities,
  Api,
  Annotations extends AnyAnnotations,
  Brand,
> extends Schema<BrandedCapabilities<C, Brand>, Api, Annotations> {
  static type = '@typed/io/Branded'
  readonly type = BrandedSchema.type

  get api(): Api {
    return this.schema.api
  }

  constructor(readonly schema: Schema<C, Api, Annotations>) {
    super()
  }
}

export const brand =
  <B extends Branded<any, any>>() =>
  <C extends AnyCapabilities, Api, Annotations extends AnyAnnotations>(
    schema: Schema<C, Api, Annotations>,
  ): Schema<BrandedCapabilities<C, B>, Api, Annotations> =>
    new BrandedSchema(schema)
