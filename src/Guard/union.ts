import { Guard } from './Guard'

export const union = <A extends ReadonlyArray<any>>(
  ...guards: { readonly [K in keyof A]: Guard<A[K]> }
): Guard<A[number]> => Guard((i): i is A[number] => guards.some((g) => g.is(i)))

export const or =
  <B>(right: Guard<B>) =>
  <A>(left: Guard<A>): Guard<A | B> =>
    union(left, right)
