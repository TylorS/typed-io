import { Associative } from 'hkt-ts/Typeclass/Associative'
import { AssociativeBoth1 } from 'hkt-ts/Typeclass/AssociativeBoth'
import { AssociativeEither1 } from 'hkt-ts/Typeclass/AssociativeEither'

import * as Guard from './Guard'

export const makeAndAssociative = <A>(): Associative<Guard.Guard<A>> => ({
  concat: (f, s) => Guard.and(s)(f),
})

export const makeOrAssociative = <A>(): Associative<Guard.Guard<A>> => ({
  concat: (f, s) => Guard.or(s)(f),
})

export const AssociativeBoth: AssociativeBoth1<Guard.GuardHKT> = {
  both:
    <B>(s: Guard.Guard<B>) =>
    <A>(f: Guard.Guard<A>) =>
      Guard.tuple([f, s] as const),
}

export const both = AssociativeBoth.both

export const AssociativeEither: AssociativeEither1<Guard.GuardHKT> = {
  either:
    <B>(s: Guard.Guard<B>) =>
    <A>(f: Guard.Guard<A>) =>
      Guard.either(f, s),
}
