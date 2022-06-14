import { flow, pipe } from 'hkt-ts'
import * as A from 'hkt-ts/Array'
import { RoseTree } from 'hkt-ts/RoseTree'
import { drawForest, drawTree } from 'hkt-ts/Tree'
import * as D from 'hkt-ts/Typeclass/Debug'
import * as N from 'hkt-ts/number'

import { ToRoseTree } from './BuiltinErrors'
import {
  CompoundError,
  LazyError,
  LeafError,
  MemberError,
  MissingIndexes,
  MissingKeys,
  NamedError,
  NullableError,
  OptionalError,
  OptionalIndex,
  OptionalKey,
  RequiredIndex,
  RequiredKey,
  SchemaError,
  SumError,
  UnexpectedIndexes,
  UnexpectedKeys,
  matchSchemaError,
} from './SchemaError'

const plural = (s: string, n: number, postfix = 's') => (n === 1 ? s : `${s}${postfix}`)
const pluralWithLength = (s: string, length: number, postfix?: string) =>
  `${length} ${plural(s, length, postfix)}`

const sum = A.foldMap(N.IdentitySum)

export const length = <E>(error: SchemaError<E>): number =>
  pipe(
    error,
    matchSchemaError({
      Compound: (e) => pipe(e.errors, sum(length)),
      Lazy: (e) => length(e.error),
      Leaf: () => 1,
      Member: (e) => length(e.error),
      MissingIndexes: () => 1,
      MissingKeys: () => 1,
      Named: (e) => length(e.error),
      Nullable: (e) => length(e.error),
      Optional: (e) => length(e.error),
      OptionalIndex: (e) => length(e.error),
      OptionalKey: (e) => length(e.error),
      RequiredIndex: (e) => length(e.error),
      RequiredKey: (e) => length(e.error),
      Sum: (e) => length(e.error),
      UnexpectedIndexes: () => 1,
      UnexpectedKeys: () => 1,
    }),
  )

export const makeToRoseTree = <Error>(print: (e: Error) => RoseTree<string>) => {
  const toRoseTree = (error: SchemaError<Error>): RoseTree<string> => {
    return pipe(
      error,
      matchSchemaError({
        Compound: (error: CompoundError<SchemaError<Error>>) => {
          const l = length(error)

          return RoseTree(
            `(${error.name}) ${pluralWithLength('error', l)} encountered`,
            error.errors.map(toRoseTree),
          )
        },
        Lazy: (error: LazyError<SchemaError<Error>>) => toRoseTree(error.error),
        Leaf: (error: LeafError<Error>) => print(error.error),
        Member: (error: MemberError<SchemaError<Error>>) =>
          RoseTree(
            `${pluralWithLength('Error', length(error.error))} encountered with member ${
              error.member
            }`,
            [toRoseTree(error.error)],
          ),
        MissingIndexes: (error: MissingIndexes) =>
          RoseTree(
            `Missing ${plural('Index', error.errors.length, 'es')} at ${error.errors.join(', ')}`,
          ),
        MissingKeys: (error: MissingKeys) =>
          RoseTree(`Missing  ${plural('Key', error.errors.length)} at ${error.errors.join(', ')}`),
        Named: (error: NamedError<string, SchemaError<Error>>) =>
          RoseTree(error.name, [toRoseTree(error.error)]),
        Nullable: (error: NullableError<SchemaError<Error>>) =>
          RoseTree(
            `${pluralWithLength(
              'Error',
              length(error.error),
            )} encountered while processing nullable value`,
            [toRoseTree(error.error)],
          ),
        Optional: (error: OptionalError<SchemaError<Error>>) =>
          RoseTree(`${pluralWithLength('Optional Error', length(error.error))}`, [
            toRoseTree(error.error),
          ]),
        OptionalIndex: (error: OptionalIndex<SchemaError<Error>>) =>
          RoseTree(
            `${pluralWithLength('Optional Index Error', length(error.error))} at index ${
              error.index
            }`,
            [toRoseTree(error.error)],
          ),
        OptionalKey: (error: OptionalKey<PropertyKey, SchemaError<Error>>) =>
          RoseTree(
            `${pluralWithLength(
              'Optional Key Error',
              length(error.error),
            )} at key ${error.key.toString()}`,
            [toRoseTree(error.error)],
          ),
        RequiredIndex: (error: RequiredIndex<SchemaError<Error>>) =>
          RoseTree(
            `${pluralWithLength('Required Index Error', length(error.error))} at index ${
              error.index
            }`,
            [toRoseTree(error.error)],
          ),
        RequiredKey: (error: RequiredKey<PropertyKey, SchemaError<Error>>) =>
          RoseTree(
            `${pluralWithLength(
              'Required Key Error',
              length(error.error),
            )} at key ${error.key.toString()}`,
            [toRoseTree(error.error)],
          ),
        Sum: (error: SumError<SchemaError<Error>>) =>
          RoseTree(
            `${pluralWithLength(
              'Error',
              length(error.error),
            )} encountered while processing Sum Type`,
            [toRoseTree(error.error)],
          ),
        UnexpectedIndexes: (error: UnexpectedIndexes) =>
          RoseTree(
            `Unexpected ${plural('Index', error.errors.length, 'es')} at ${error.errors.join(
              ', ',
            )}`,
          ),
        UnexpectedKeys: (error: UnexpectedKeys) =>
          RoseTree(
            `Unexpected ${plural('Key', error.errors.length)} at ${error.errors.join(', ')}`,
          ),
      }),
    )
  }

  return toRoseTree
}

export const makeDebug = <Error>(
  print: (e: Error) => RoseTree<string>,
): D.Debug<SchemaError<Error>> => {
  return D.Debug(flow(makeToRoseTree(print), drawTree))
}

export const makeDebugArray = <Error>(
  print: (e: Error) => RoseTree<string>,
): D.Debug<ReadonlyArray<SchemaError<Error>>> => {
  return D.Debug(flow(A.map(makeToRoseTree(print)), drawForest))
}

export const toRoseTree = (e: ToRoseTree) => e.toRoseTree()
export const { debug: printSchemaError } = makeDebug(toRoseTree)
export const { debug: printSchemaErrors } = makeDebugArray(toRoseTree)
