import { NonEmptyArray } from 'hkt-ts/NonEmptyArray'
import { ReadonlyRecord } from 'hkt-ts/Record'
import { U } from 'ts-toolbelt'

import * as CS from '@/Constraints/struct'
import { AnySchema, Property, Schema, SchemaHKT } from '@/Schema'
import { TupleAnnotations } from '@/schemas/core/tuple'

export interface StructConstraints<
  Props extends ReadonlyRecord<string, Property<AnySchema, boolean>>,
  Additional extends AnySchema = never,
  PatternProperties extends ReadonlyRecord<string, AnySchema> = never,
  Dependencies extends ReadonlyRecord<
    keyof Props & string,
    AnySchema | NonEmptyArray<keyof Props & string>
  > = never,
> extends CS.StructConstraints<SchemaHKT, Props, Additional, PatternProperties, Dependencies> {}

export interface StructCapabilities<
  Props extends ReadonlyRecord<string, Property<AnySchema, boolean>>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Additional extends AnySchema = never,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  PatternProperties extends ReadonlyRecord<string, AnySchema> = never,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Dependencies extends ReadonlyRecord<
    keyof Props & string,
    AnySchema | NonEmptyArray<keyof Props & string>
  > = never,
> {}

export interface StructApi<Props extends ReadonlyRecord<string, Property<AnySchema, boolean>>> {
  readonly props: Props
}

export class StructSchema<
  Props extends ReadonlyRecord<string, Property<AnySchema, boolean>>,
  Additional extends AnySchema = never,
  PatternProperties extends ReadonlyRecord<string, AnySchema> = never,
  Dependencies extends ReadonlyRecord<
    keyof Props & string,
    AnySchema | NonEmptyArray<keyof Props & string>
  > = never,
> extends Schema<
  StructCapabilities<Props, Additional, PatternProperties, Dependencies>,
  StructApi<Props>,
  TupleAnnotations<U.ListOf<Props[string]['value']>>
> {
  static type = '@typed/io/Struct' as const
  readonly type = StructSchema.type

  get api() {
    return {
      props: this.props,
    }
  }

  constructor(
    readonly props: Props,
    readonly constraints?: StructConstraints<Props, Additional, PatternProperties, Dependencies>,
  ) {
    super()
  }
}

export const struct: <
  Props extends ReadonlyRecord<string, Property<AnySchema, boolean>>,
  Additional extends AnySchema = never,
  PatternProperties extends ReadonlyRecord<string, AnySchema> = never,
  Dependencies extends ReadonlyRecord<
    keyof Props & string,
    AnySchema | NonEmptyArray<keyof Props & string>
  > = never,
>(
  properties: Props,
  constraints?: StructConstraints<Props, Additional, PatternProperties, Dependencies>,
) => Schema<
  StructCapabilities<Props, Additional, PatternProperties, Dependencies>,
  StructApi<Props>,
  TupleAnnotations<U.ListOf<Props[string]['value']>>
> = (properties, constraints) => new StructSchema(properties, constraints) as any
