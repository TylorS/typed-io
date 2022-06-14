import { flow, pipe } from 'hkt-ts'
import { RoseTree } from 'hkt-ts/RoseTree'
import { drawTree } from 'hkt-ts/Tree'
import * as D from 'hkt-ts/Typeclass/Debug'

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

export const makeDebug = <Error>(
  print: (e: Error) => RoseTree<string>,
): D.Debug<SchemaError<Error>> => {
  const printError = (error: SchemaError<Error>): RoseTree<string> => {
    return pipe(
      error,
      matchSchemaError({
        Compound: (error: CompoundError<SchemaError<Error>>) =>
          RoseTree(error.name, error.errors.map(printError)),
        Lazy: (error: LazyError<SchemaError<Error>>) => printError(error.error),
        Leaf: (error: LeafError<Error>) => print(error.error),
        Member: (error: MemberError<SchemaError<Error>>) =>
          RoseTree(`${error.member}`, [printError(error.error)]),
        MissingIndexes: (error: MissingIndexes) =>
          RoseTree(
            `Missing ${plural('Index', error.errors.length, 'es')} at ${error.errors.join(', ')}`,
          ),
        MissingKeys: (error: MissingKeys) =>
          RoseTree(`Missing  ${plural('Key', error.errors.length)} at ${error.errors.join(', ')}`),
        Named: (error: NamedError<string, SchemaError<Error>>) =>
          RoseTree(error.name, [printError(error.error)]),
        Nullable: (error: NullableError<SchemaError<Error>>) =>
          RoseTree(`Error encounted while processing nullable value`, [printError(error.error)]),
        Optional: (error: OptionalError<SchemaError<Error>>) =>
          RoseTree(`Optional Error`, [printError(error.error)]),
        OptionalIndex: (error: OptionalIndex<SchemaError<Error>>) =>
          RoseTree(`Optional Index Error at index ${error.index}`, [printError(error.error)]),
        OptionalKey: (error: OptionalKey<PropertyKey, SchemaError<Error>>) =>
          RoseTree(`Optional Key Error at key ${error.key.toString()}`, [printError(error.error)]),
        RequiredIndex: (error: RequiredIndex<SchemaError<Error>>) =>
          RoseTree(`Required Index Error at index ${error.index}`, [printError(error.error)]),
        RequiredKey: (error: RequiredKey<PropertyKey, SchemaError<Error>>) =>
          RoseTree(`Required Key Error at key ${error.key.toString()}`, [printError(error.error)]),
        Sum: (error: SumError<SchemaError<Error>>) =>
          RoseTree(`Error(s) encountered while processing Sum Type`, [printError(error.error)]),
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

  return D.Debug(flow(printError, drawTree))
}

export const { debug: printSchemaError } = makeDebug((e: ToRoseTree) => e.toRoseTree())
