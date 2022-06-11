import { Refinement } from 'hkt-ts/Refinement'

import { Guard } from '@/Guard/Guard'
import {
  AnyAnnotations,
  AnyCapabilities,
  AnySchemaWith,
  ContinuationSymbol,
  HasContinuation,
  Schema,
} from '@/Schema'

export const GUARD = Symbol('@typed/io/GUARD')
export type GUARD = typeof GUARD

export type AnyGuardCapability = GuardCapability<any>

export type GuardOf<A> = A extends AnySchemaWith<infer R>
  ? GUARD extends keyof R
    ? R[GUARD]
    : never
  : never

export type GuardOutputOf<T> = [GuardOf<T>] extends [Guard<infer R>] ? R : never

export interface GuardCapability<A> {
  readonly [GUARD]: Guard<A>
}

export class GuardSchema<C extends AnyCapabilities, Api, Annotations extends AnyAnnotations, A>
  extends Schema<Omit<C, GUARD> & GuardCapability<A>, Api, Annotations>
  implements HasContinuation
{
  static type = 'Guard' as const
  readonly type = GuardSchema.type

  get api() {
    return this.schema.api
  }

  readonly [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<C, Api, Annotations>,
    readonly guard: Refinement<unknown, A>,
  ) {
    super()
  }
}

export const guard =
  <A>(guard: Refinement<unknown, A>) =>
  <C extends AnyCapabilities, Api, Annotations extends AnyAnnotations>(
    schema: Schema<C, Api, Annotations>,
  ): Schema<Omit<C, GUARD> & GuardCapability<A>, Api, Annotations> =>
    new GuardSchema(schema, guard)
