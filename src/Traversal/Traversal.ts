import {
  HKT,
  HKT10,
  HKT2,
  HKT3,
  HKT4,
  HKT5,
  HKT6,
  HKT7,
  HKT8,
  HKT9,
  Kind,
  Kind10,
  Kind2,
  Kind3,
  Kind4,
  Kind5,
  Kind6,
  Kind7,
  Kind8,
  Kind9,
} from 'hkt-ts/HKT'
import {
  Covariant,
  Covariant1,
  Covariant10,
  Covariant2,
  Covariant2EC,
  Covariant3,
  Covariant3EC,
  Covariant3RC,
  Covariant3REC,
  Covariant4,
  Covariant4EC,
  Covariant4RC,
  Covariant4REC,
  Covariant4SC,
  Covariant4SEC,
  Covariant4SRC,
  Covariant4SREC,
  Covariant5,
  Covariant6,
  Covariant7,
  Covariant8,
  Covariant9,
} from 'hkt-ts/Typeclass/Covariant'
import {
  IdentityBoth,
  IdentityBoth1,
  IdentityBoth10,
  IdentityBoth2,
  IdentityBoth2EC,
  IdentityBoth3,
  IdentityBoth3EC,
  IdentityBoth3RC,
  IdentityBoth3REC,
  IdentityBoth4,
  IdentityBoth4EC,
  IdentityBoth4RC,
  IdentityBoth4REC,
  IdentityBoth4SC,
  IdentityBoth4SEC,
  IdentityBoth4SRC,
  IdentityBoth4SREC,
  IdentityBoth5,
  IdentityBoth6,
  IdentityBoth7,
  IdentityBoth8,
  IdentityBoth9,
} from 'hkt-ts/Typeclass/IdentityBoth'

export interface Traversal<A, B> {
  readonly modify: {
    <T extends HKT10>(IBC: IdentityBoth10<T> & Covariant10<T>): <Z, Y, X, W, V, U, S, R, E>(
      f: (b: B) => Kind10<T, Z, Y, X, W, V, U, S, R, E, B>,
    ) => (a: A) => Kind10<T, Z, Y, X, W, V, U, S, R, E, A>
    <T extends HKT9>(IBC: IdentityBoth9<T> & Covariant9<T>): <Y, X, W, V, U, S, R, E>(
      f: (b: B) => Kind9<T, Y, X, W, V, U, S, R, E, B>,
    ) => (a: A) => Kind9<T, Y, X, W, V, U, S, R, E, A>
    <T extends HKT8>(IBC: IdentityBoth8<T> & Covariant8<T>): <X, W, V, U, S, R, E>(
      f: (b: B) => Kind8<T, X, W, V, U, S, R, E, B>,
    ) => (a: A) => Kind8<T, X, W, V, U, S, R, E, A>
    <T extends HKT7>(IBC: IdentityBoth7<T> & Covariant7<T>): <W, V, U, S, R, E>(
      f: (b: B) => Kind7<T, W, V, U, S, R, E, B>,
    ) => (a: A) => Kind7<T, W, V, U, S, R, E, A>
    <T extends HKT6>(IBC: IdentityBoth6<T> & Covariant6<T>): <V, U, S, R, E>(
      f: (b: B) => Kind6<T, V, U, S, R, E, B>,
    ) => (a: A) => Kind6<T, V, U, S, R, E, A>
    <T extends HKT5>(IBC: IdentityBoth5<T> & Covariant5<T>): <U, S, R, E>(
      f: (b: B) => Kind5<T, U, S, R, E, B>,
    ) => (a: A) => Kind5<T, U, S, R, E, A>
    <T extends HKT4, E>(IBC: IdentityBoth4EC<T, E> & Covariant4EC<T, E>): <S, R>(
      f: (b: B) => Kind4<T, S, R, E, B>,
    ) => (a: A) => Kind4<T, S, R, E, A>
    <T extends HKT4, R, E>(IBC: IdentityBoth4REC<T, R, E> & Covariant4REC<T, R, E>): <S>(
      f: (b: B) => Kind4<T, S, R, E, B>,
    ) => (a: A) => Kind4<T, S, R, E, A>
    <T extends HKT4, S, E>(IBC: IdentityBoth4SEC<T, S, E> & Covariant4SEC<T, S, E>): <R>(
      f: (b: B) => Kind4<T, S, R, E, B>,
    ) => (a: A) => Kind4<T, S, R, E, A>
    <T extends HKT4, R>(IBC: IdentityBoth4RC<T, R> & Covariant4RC<T, R>): <S, E>(
      f: (b: B) => Kind4<T, S, R, E, B>,
    ) => (a: A) => Kind4<T, S, R, E, A>
    <T extends HKT4, S, R>(IBC: IdentityBoth4SRC<T, S, R> & Covariant4SRC<T, S, R>): <E>(
      f: (b: B) => Kind4<T, S, R, E, B>,
    ) => (a: A) => Kind4<T, S, R, E, A>
    <T extends HKT4, S>(IBC: IdentityBoth4SC<T, S> & Covariant4SC<T, S>): <R, E>(
      f: (b: B) => Kind4<T, S, R, E, B>,
    ) => (a: A) => Kind4<T, S, R, E, A>
    <T extends HKT4, S, R, E>(IBC: IdentityBoth4SREC<T, S, R, E> & Covariant4SREC<T, S, R, E>): (
      f: (b: B) => Kind4<T, S, R, E, B>,
    ) => (a: A) => Kind4<T, S, R, E, A>
    <T extends HKT4>(IBC: IdentityBoth4<T> & Covariant4<T>): <S, R, E>(
      f: (b: B) => Kind4<T, S, R, E, B>,
    ) => (a: A) => Kind4<T, S, R, E, A>
    <T extends HKT3, E>(IBC: IdentityBoth3EC<T, E> & Covariant3EC<T, E>): <R>(
      f: (b: B) => Kind3<T, R, E, B>,
    ) => (a: A) => Kind3<T, R, E, A>
    <T extends HKT3, R, E>(IBC: IdentityBoth3REC<T, R, E> & Covariant3REC<T, R, E>): (
      f: (b: B) => Kind3<T, R, E, B>,
    ) => (a: A) => Kind3<T, R, E, A>
    <T extends HKT3, R>(IBC: IdentityBoth3RC<T, R> & Covariant3RC<T, R>): <E>(
      f: (b: B) => Kind3<T, R, E, B>,
    ) => (a: A) => Kind3<T, R, E, A>
    <T extends HKT3>(IBC: IdentityBoth3<T> & Covariant3<T>): <R, E>(
      f: (b: B) => Kind3<T, R, E, B>,
    ) => (a: A) => Kind3<T, R, E, A>
    <T extends HKT2, E>(IBC: IdentityBoth2EC<T, E> & Covariant2EC<T, E>): (
      f: (b: B) => Kind2<T, E, B>,
    ) => (a: A) => Kind2<T, E, A>
    <T extends HKT2>(IBC: IdentityBoth2<T> & Covariant2<T>): <E>(
      f: (b: B) => Kind2<T, E, B>,
    ) => (a: A) => Kind2<T, E, A>
    <T extends HKT>(IBC: IdentityBoth1<T> & Covariant1<T>): (
      f: (b: B) => Kind<T, B>,
    ) => (a: A) => Kind<T, A>
    <T extends HKT>(IBC: IdentityBoth<T> & Covariant<T>): (
      f: (b: B) => Kind<T, B>,
    ) => (a: A) => Kind<T, A>
  }
}
