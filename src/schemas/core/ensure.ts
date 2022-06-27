import { HKT, Kind_ } from 'hkt-ts'

import { GuardOutputOf } from '@/Guard/GuardSchema'
import {
  AnyAnnotations,
  AnyCapabilities,
  AnySchema,
  ContinuationSymbol,
  HasContinuation,
  Schema,
} from '@/Schema'
import {} from '@/internal'
import { SumApi } from '@/schemas/core/sum'

export interface EnsureCapabilitiesHKT<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  C extends AnyCapabilities,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends HKT,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Schemas extends ReadonlyArray<AnySchema>,
> {}

export interface EnsureCapabilitiesStatic<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  C extends AnyCapabilities,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T,
> {}

export type EnsureCapabilities<
  C extends AnyCapabilities,
  T,
  Schemas extends ReadonlyArray<AnySchema> = readonly [],
> = T extends HKT ? EnsureCapabilitiesHKT<C, T, Schemas> : EnsureCapabilitiesStatic<C, T>

export class EnsureSchema<
    C extends AnyCapabilities,
    Api,
    Annotations extends AnyAnnotations,
    T,
    Schemas extends ReadonlyArray<AnySchema> = readonly [],
  >
  extends Schema<EnsureCapabilities<C, T, Schemas>, EnsureApi<Api, T, Schemas>, Annotations>
  implements HasContinuation
{
  static type = '@typed/io/Ensure'
  readonly type = EnsureSchema.type

  get api(): EnsureApi<Api, T, Schemas> {
    return this.schema.api as any
  }

  readonly __NOT_AVAILABLE_AT_RUNTIME__!: Schema<
    EnsureCapabilities<C, T, Schemas>,
    EnsureApi<Api, T, Schemas>,
    Annotations
  >['__NOT_AVAILABLE_AT_RUNTIME__'] & {
    readonly _Ensuring: T
  };

  readonly [ContinuationSymbol] = this.schema

  constructor(readonly schema: Schema<C, Api, Annotations>) {
    super()
  }
}

export function ensure<T extends HKT, Schemas extends ReadonlyArray<AnySchema> = readonly []>(): <
  C extends AnyCapabilities,
  Api,
  Annotations extends AnyAnnotations,
>(
  schema: Schema<C, Api, Annotations>,
) => Schema<EnsureCapabilitiesHKT<C, T, Schemas>, EnsureApi<Api, T, Schemas>, Annotations>

export function ensure<T>(): <C extends AnyCapabilities, Api, Annotations extends AnyAnnotations>(
  schema: Schema<C, Api, Annotations>,
) => Schema<EnsureCapabilitiesStatic<C, T>, EnsureApi<Api, T>, Annotations>

export function ensure<T, Schemas extends ReadonlyArray<AnySchema> = readonly []>() {
  return <C extends AnyCapabilities, Api, Annotations extends AnyAnnotations>(
    schema: Schema<C, Api, Annotations>,
  ): Schema<EnsureCapabilities<C, T, Schemas>, EnsureApi<Api, T, Schemas>, Annotations> =>
    new EnsureSchema(schema) as any
}

export type EnsureApi<
  Api,
  T,
  Schemas extends ReadonlyArray<AnySchema> = readonly [],
> = Api extends SumApi<infer Tag, infer Members>
  ? SumApi<
      Tag,
      {
        readonly [K in keyof Members]: Members[K] extends Schema<infer C, infer A, infer AS>
          ? Schema<
              EnsureCapabilities<
                C,
                T extends HKT
                  ? Extract<Kind_<[T], Schemas>, GuardOutputOf<C>>
                  : Extract<T, GuardOutputOf<C>>,
                Schemas
              >,
              EnsureApi<
                A,
                T extends HKT
                  ? Extract<Kind_<[T], Schemas>, GuardOutputOf<C>>
                  : Extract<T, GuardOutputOf<C>>
              >,
              AS
            >
          : never
      }
    >
  : Api
