import * as CR from '@/Constraints/record'
import type { GuardOutputOf } from '@/Guard/GuardSchema'
import { AnyAnnotations, AnyCapabilities, Schema, SchemaHKT } from '@/Schema'
import { Compact } from '@/internal'

export interface RecordConstraints<K extends string, A>
  extends CR.RecordConstraints<SchemaHKT, K, A> {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RecordCapabilities<C extends AnyCapabilities, K extends string = string> {}

export class RecordSchema<
  C extends AnyCapabilities,
  Api,
  Annotations extends AnyAnnotations,
  K extends string = string,
> extends Schema<
  RecordCapabilities<C>,
  {
    readonly codomain: Schema<C, Api, Annotations>
  },
  Annotations
> {
  static type = '@typed/io/Record' as const
  readonly type = RecordSchema.type

  get api() {
    return {
      codomain: this.codomain,
    }
  }

  constructor(
    readonly codomain: Schema<C, Api, Annotations>,
    readonly constraints?: RecordConstraints<K, GuardOutputOf<C>>,
  ) {
    super()
  }
}

export const record = <
  C extends AnyCapabilities,
  Api,
  Annotations extends AnyAnnotations,
  K extends string = string,
>(
  codomain: Schema<C, Api, Annotations>,
  // TODO: What's the best way to extract values out of Schemas when interpreters are external?
  constraints?: RecordConstraints<K, GuardOutputOf<C>>,
): Schema<
  Compact<RecordCapabilities<C>>,
  {
    readonly codomain: Schema<C, Api, Annotations>
  },
  Annotations
> => new RecordSchema(codomain, constraints)
