import { Associative } from 'hkt-ts/Typeclass/Associative'
import { AssociativeBoth1 } from 'hkt-ts/Typeclass/AssociativeBoth'
import { AssociativeEither1 } from 'hkt-ts/Typeclass/AssociativeEither'

import { Guard, GuardHKT } from './Guard'
import { either } from './either'
import { intersection } from './intersection'
import { tuple } from './tuple'
import { union } from './union'

export const makeAndAssociative = <A>(): Associative<Guard<A>> => ({
  concat: intersection,
})

export const makeOrAssociative = <A>(): Associative<Guard<A>> => ({
  concat: union,
})

export const AssociativeBoth: AssociativeBoth1<GuardHKT> = {
  both:
    <B>(s: Guard<B>) =>
    <A>(f: Guard<A>) =>
      tuple([f, s] as const),
}

export const both = AssociativeBoth.both

export const AssociativeEither: AssociativeEither1<GuardHKT> = {
  either:
    <B>(s: Guard<B>) =>
    <A>(f: Guard<A>) =>
      either(f, s),
}
