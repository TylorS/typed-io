import { identity, pipe } from 'hkt-ts'
import { makeFlatMap } from 'hkt-ts/These'
import { Associative } from 'hkt-ts/Typeclass/Associative'

export type SchemaError<E> =
  | CompoundError<SchemaError<E>>
  | LazyError<SchemaError<E>>
  | LeafError<E>
  | MemberError<SchemaError<E>>
  | MissingIndexes
  | MissingKeys
  | NamedError<string, SchemaError<E>>
  | NullableError<SchemaError<E>>
  | OptionalError<SchemaError<E>>
  | OptionalIndex<SchemaError<E>>
  | OptionalKey<PropertyKey, SchemaError<E>>
  | RequiredIndex<SchemaError<E>>
  | RequiredKey<PropertyKey, SchemaError<E>>
  | SumError<SchemaError<E>>
  | UnexpectedIndexes
  | UnexpectedKeys

export interface Compound<E> {
  readonly errors: ReadonlyArray<E>
}

export const compound = <Tag extends string>(tag: Tag) =>
  class CompoundError<E> implements Compound<E> {
    static tag = tag
    readonly tag = tag

    constructor(readonly errors: ReadonlyArray<E>) {}
  }

export interface Single<E> {
  readonly error: E
}

export const single = <Tag extends string>(tag: Tag) =>
  class SingleError<E> implements Single<E> {
    static tag = tag
    readonly tag = tag

    constructor(readonly error: E) {}
  }

export class LeafError<E> extends single('Leaf')<E> {}

export class NullableError<E> extends single('Nullable')<E> {}

export class OptionalError<E> extends single('Optional')<E> {}

export class RequiredKey<K extends PropertyKey, E> extends single('RequiredKey')<E> {
  constructor(readonly key: K, error: E) {
    super(error)
  }
}

export class OptionalKey<K extends PropertyKey, E> extends single('OptionalKey')<E> {
  constructor(readonly key: K, error: E) {
    super(error)
  }
}

export class RequiredIndex<E> extends single('RequiredIndex')<E> {
  constructor(readonly index: number, error: E) {
    super(error)
  }
}

export class OptionalIndex<E> extends single('OptionalIndex')<E> {
  constructor(readonly index: number, error: E) {
    super(error)
  }
}

export class MemberError<E> extends single('Member')<E> {
  constructor(readonly member: string | number, error: E) {
    super(error)
  }
}

export class LazyError<E> extends single('Lazy')<E> {}

export class SumError<E> extends single('Sum')<E> {}

export class CompoundError<E> extends compound('Compound')<E> {
  constructor(readonly name: string, errors: readonly E[]) {
    super(errors)
  }
}

export class UnexpectedKeys extends compound('UnexpectedKeys')<string> {}
export class MissingKeys extends compound('MissingKeys')<string> {}

export class UnexpectedIndexes extends compound('UnexpectedIndexes')<number> {}
export class MissingIndexes extends compound('MissingIndexes')<number> {}

export class NamedError<Name extends string, E> extends single('Named')<E> {
  constructor(readonly name: Name, error: E) {
    super(error)
  }
}

export function makeDecodeErrorAssociative<E>(name: string): Associative<SchemaError<E>> {
  return {
    concat: (f, s) => {
      const fIsCompound = f.tag === 'Compound'
      const sIsCompound = s.tag === 'Compound'

      if (fIsCompound && sIsCompound) {
        return new CompoundError(name, [...f.errors, ...s.errors])
      }

      if (fIsCompound) {
        return new CompoundError(name, [...f.errors, s])
      }

      if (sIsCompound) {
        return new CompoundError(name, [f, ...s.errors])
      }

      return new CompoundError(name, [f, s])
    },
  }
}

export function makeDecodeErrorFlatMap<E>(name: string) {
  return makeFlatMap(makeDecodeErrorAssociative<E>(name))
}

export function matchSchemaError<Error, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(patterns: {
  Compound: (error: CompoundError<SchemaError<Error>>) => A
  Lazy: (error: LazyError<SchemaError<Error>>) => B
  Leaf: (error: LeafError<Error>) => C
  Member: (error: MemberError<SchemaError<Error>>) => D
  MissingIndexes: (error: MissingIndexes) => E
  MissingKeys: (error: MissingKeys) => F
  Named: (error: NamedError<string, SchemaError<Error>>) => G
  Nullable: (error: NullableError<SchemaError<Error>>) => H
  Optional: (error: OptionalError<SchemaError<Error>>) => I
  OptionalIndex: (error: OptionalIndex<SchemaError<Error>>) => J
  OptionalKey: (error: OptionalKey<PropertyKey, SchemaError<Error>>) => K
  RequiredIndex: (error: RequiredIndex<SchemaError<Error>>) => L
  RequiredKey: (error: RequiredKey<PropertyKey, SchemaError<Error>>) => M
  Sum: (error: SumError<SchemaError<Error>>) => N
  UnexpectedIndexes: (error: UnexpectedIndexes) => O
  UnexpectedKeys: (error: UnexpectedKeys) => P
}) {
  return (error: SchemaError<Error>): B | C | D | E | F | G | H | I | J | K | L | M | N | O | P =>
    (patterns[error.tag] as any)(error)
}

export function mapSchemaError<E1, E2>(f: (e1: E1) => E2) {
  return (error: SchemaError<E1>): SchemaError<E2> =>
    pipe(
      error,
      matchSchemaError({
        Compound: (c) => ({ ...c, errors: c.errors.map(mapSchemaError(f)) }),
        Lazy: (l) => ({ ...l, error: pipe(l.error, mapSchemaError(f)) }),
        Leaf: (l) => ({ ...l, error: f(l.error) }),
        Member: (m) => ({ ...m, error: pipe(m.error, mapSchemaError(f)) }),
        MissingIndexes: identity,
        MissingKeys: identity,
        Named: (n) => ({ ...n, error: pipe(n.error, mapSchemaError(f)) }),
        Nullable: (n) => ({ ...n, error: pipe(n.error, mapSchemaError(f)) }),
        Optional: (o) => ({ ...o, error: pipe(o.error, mapSchemaError(f)) }),
        OptionalIndex: (o) => ({ ...o, error: pipe(o.error, mapSchemaError(f)) }),
        OptionalKey: (o) => ({ ...o, error: pipe(o.error, mapSchemaError(f)) }),
        RequiredIndex: (r) => ({ ...r, error: pipe(r.error, mapSchemaError(f)) }),
        RequiredKey: (r) => ({ ...r, error: pipe(r.error, mapSchemaError(f)) }),
        Sum: (s) => ({ ...s, error: pipe(s.error, mapSchemaError(f)) }),
        UnexpectedIndexes: identity,
        UnexpectedKeys: identity,
      }),
    )
}
