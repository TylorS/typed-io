import { HKT, Params } from 'hkt-ts/HKT'
import { Refinement } from 'hkt-ts/Refinement'

export interface Guard<A> {
  readonly is: Refinement<unknown, A>
}

export interface GuardHKT extends HKT {
  readonly type: Guard<this[Params.A]>
}

export type AnyGuard = Guard<any>

export type OutputOf<T> = [T] extends [Guard<infer R>] ? R : never

export function Guard<A>(is: Guard<A>['is']): Guard<A> {
  return {
    is,
  }
}
