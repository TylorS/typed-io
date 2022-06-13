import { DefaultOf, HKT, Kind_, LengthOf, Params } from 'hkt-ts'
import { Json } from 'hkt-ts/Json'
import { ReadonlyRecord } from 'hkt-ts/Record'
import * as JS from 'json-schema'
import { Cast } from 'ts-toolbelt/out/Any/Cast'
import { Equals } from 'ts-toolbelt/out/Any/Equals'

/**
 * A shared set of constraints for all types as defined by JSON-Schema. Utilizes HKT abstraction from
 * hkt-ts to lift this interface into a more generic form.
 */
export interface SharedConstraints<
  T extends HKT,
  Const,
  Enum extends ReadonlyArray<any> = ReadonlyArray<Const>,
  Default = Const,
> {
  readonly $id?: string
  readonly $ref?: string
  readonly $schema?: JS.JSONSchema7Version
  readonly $comment?: string
  /**
   * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.4
   * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#appendix-A
   */
  readonly $defs?: ReadonlyRecord<string, Kind_<[T], DefaultsOf<T>>>
  readonly title?: string
  readonly description?: string
  readonly examples?: ReadonlyArray<GetSharedType<Const, Enum, Json>>
  readonly const?: Const
  readonly enum?: Enum
  readonly default?: Default
}

export type GetSharedType<Const, Enum, Fallback> = {
  0: Const
  1: {
    0: Enum extends ReadonlyArray<any> ? Enum[number] : Enum
    1: Fallback
  }[Equals<never, Enum>]
}[Equals<never, Const>]

export type PossibleParamsOf<T extends HKT> = {
  1: [Params.A]
  2: [Params.E, Params.A]
  3: [Params.R, Params.E, Params.A]
  4: [Params.S, Params.R, Params.E, Params.A]
  5: [Params.U, Params.S, Params.R, Params.E, Params.A]
  6: [Params.V, Params.U, Params.S, Params.R, Params.E, Params.A]
  7: [Params.W, Params.V, Params.U, Params.S, Params.R, Params.E, Params.A]
  8: [Params.X, Params.W, Params.V, Params.U, Params.S, Params.R, Params.E, Params.A]
  9: [Params.Y, Params.X, Params.W, Params.V, Params.U, Params.S, Params.R, Params.E, Params.A]
  10: [
    Params.Z,
    Params.Y,
    Params.X,
    Params.W,
    Params.V,
    Params.U,
    Params.S,
    Params.R,
    Params.E,
    Params.A,
  ]
}[LengthOf<T>]

export type DefaultsOf<T extends HKT> = PossibleParamsOf<T> extends infer R
  ? Cast<
      { readonly [K in keyof R]: R[K] extends Params ? DefaultOf<T, R[K]> : never },
      readonly any[]
    >
  : never
