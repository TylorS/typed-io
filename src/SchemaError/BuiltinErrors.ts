/* eslint-disable @typescript-eslint/no-unused-vars */
import { RoseTree } from 'hkt-ts/RoseTree'

import { printSchemaError } from './Debug'
import { LeafError, SchemaError } from './SchemaError'

import { StringFormat } from '@/JsonSchema/JsonSchema'

export interface Actual<I> {
  readonly actual: I
}

export interface ToRoseTree {
  readonly toRoseTree: () => RoseTree<string>
}

const stringify = (x: unknown) => JSON.stringify(x, null, 2)

export const actual =
  <I>(print: (input: I) => RoseTree<string>) =>
  <Type extends string>(type: Type) =>
    class ActualError implements Actual<I>, ToRoseTree {
      static type = `@typed/io/${type}` as `@typed/io/${Type}`
      readonly type = ActualError.type as `@typed/io/${Type}`
      readonly toRoseTree: () => RoseTree<string>

      constructor(readonly actual: I) {
        this.toRoseTree = () => print(actual)
      }

      static leaf = (actual: I) => new LeafError(new ActualError(actual))
    }

const expectedError = (expected: string) => (input: unknown) =>
  RoseTree(`Expected ${expected} but received ${stringify(input)}`)

export class StringError extends actual(expectedError('string'))('String') {
  static leaf = (actual: unknown): LeafError<StringError> => super.leaf(actual)
}

export class NumberError extends actual(expectedError('number'))('Number') {
  static leaf = (actual: unknown): LeafError<NumberError> => super.leaf(actual)
}

export class IntegerError
  extends actual(expectedError('integer'))('Integer')
  implements ToRoseTree
{
  static leaf = (actual: unknown): LeafError<IntegerError> => super.leaf(actual)
}

export class NaNError extends actual((_: typeof NaN) =>
  RoseTree(`Expected number but received NaN`),
)('NaN') {
  static leaf = (actual: number): LeafError<NaNError> => super.leaf(actual)
}

export class NegativeInfinityError extends actual((_: typeof Infinity) =>
  RoseTree(`Expected number but received -Infinity`),
)('-Infinity') {
  static leaf = (actual: number): LeafError<NegativeInfinityError> => super.leaf(actual)
}

export class PositiveInfinityError extends actual((_: typeof Infinity) =>
  RoseTree(`Expected number but received +Infinity`),
)('+Infinity') {
  static leaf = (actual: number): LeafError<PositiveInfinityError> => super.leaf(actual)
}

export class BooleanError extends actual(expectedError('boolean'))('Boolean') {
  static leaf = (actual: unknown): LeafError<BooleanError> => super.leaf(actual)
}

export class UnknownArrayError extends actual(expectedError('Array'))('UnknownArray') {
  static leaf = (actual: unknown): LeafError<UnknownArrayError> => super.leaf(actual)
}

export class UnknownRecordError extends actual(expectedError('Record'))('UnknownRecord') {
  static leaf = (actual: unknown): LeafError<UnknownRecordError> => super.leaf(actual)
}

export class ConstError<E> implements Actual<unknown>, ToRoseTree {
  static type = '@typed/io/Const' as const
  readonly type = ConstError.type
  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly expected: E, readonly actual: unknown) {
    this.toRoseTree = () =>
      RoseTree(`Expected exactly ${stringify(expected)} but received ${stringify(actual)}`)
  }

  static leaf = <E>(expected: E, actual: unknown): LeafError<ConstError<E>> =>
    new LeafError(new ConstError(expected, actual))
}

export class EnumError<E extends ReadonlyArray<any>> implements Actual<unknown>, ToRoseTree {
  static type = '@typed/io/Enum' as const
  readonly type = ConstError.type
  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly expected: E, readonly actual: unknown) {
    this.toRoseTree = () =>
      RoseTree(
        `Enum Error :: Expected one of the following`,
        expected.map((e) => RoseTree(`Expected ${stringify(e)} but received ${stringify(actual)}`)),
      )
  }

  static leaf = <E extends ReadonlyArray<any>>(
    expected: E,
    actual: unknown,
  ): LeafError<EnumError<E>> => new LeafError(new EnumError(expected, actual))
}

export class MessageError implements ToRoseTree {
  static type = '@typed/io/Message' as const
  readonly type = MessageError.type

  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly message: string) {
    this.toRoseTree = () => RoseTree(message)
  }

  static leaf = (message: string): LeafError<MessageError> =>
    new LeafError(new MessageError(message))
}

export class InvalidDateError extends actual(expectedError('ISO8601-formatted Date String'))(
  'InvalidDate',
) {}

export class MinLengthError<A> implements Actual<A>, ToRoseTree {
  static type = '@typed/io/MinLength' as const
  readonly type = MinLengthError.type
  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly actual: A, readonly minLength: number, readonly actualLength: number) {
    this.toRoseTree = () =>
      RoseTree(
        `Expected ${stringify(
          actual,
        )} minimum length of ${minLength} but received a length of ${actualLength}`,
      )
  }

  static leaf = <A>(
    actual: A,
    minLength: number,
    actualLength: number,
  ): LeafError<MinLengthError<A>> =>
    new LeafError(new MinLengthError(actual, minLength, actualLength))
}

export class MaxLengthError<A> implements Actual<A>, ToRoseTree {
  static type = '@typed/io/MaxLength' as const
  readonly type = MaxLengthError.type
  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly actual: A, readonly maxLength: number, readonly actualLength: number) {
    this.toRoseTree = () =>
      RoseTree(
        `Expected ${stringify(
          actual,
        )} maximum length of ${maxLength} but received a length of ${actualLength}`,
      )
  }

  static leaf = <A>(
    actual: A,
    maxLength: number,
    actualLength: number,
  ): LeafError<MaxLengthError<A>> =>
    new LeafError(new MaxLengthError(actual, maxLength, actualLength))
}

export class PatternError implements Actual<string>, ToRoseTree {
  static type = '@typed/io/Pattern' as const
  readonly type = PatternError.type
  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly actual: string, readonly pattern: RegExp) {
    this.toRoseTree = () => RoseTree(`Expected ${actual} to match RegExp pattern ${pattern}.`)
  }

  static leaf = (actual: string, pattern: RegExp): LeafError<PatternError> =>
    new LeafError(new PatternError(actual, pattern))
}

export class FormatError implements Actual<string>, ToRoseTree {
  static type = '@typed/io/Format' as const
  readonly type = FormatError.type
  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly actual: string, readonly format: StringFormat) {
    this.toRoseTree = () => RoseTree(`Expected ${actual} to match format ${format}.`)
  }

  static leaf = (actual: string, format: StringFormat): LeafError<FormatError> =>
    new LeafError(new FormatError(actual, format))
}

export class MinPropertiesError<A> implements Actual<A>, ToRoseTree {
  static type = '@typed/io/MinProperties' as const
  readonly type = MinPropertiesError.type
  readonly toRoseTree: () => RoseTree<string>

  constructor(
    readonly actual: A,
    readonly minProperties: number,
    readonly actualPropertyCount: number,
  ) {
    this.toRoseTree = () =>
      RoseTree(
        `Expected ${stringify(
          actual,
        )} minimum of ${minProperties} properties but found ${actualPropertyCount}`,
      )
  }

  static leaf = <A>(
    actual: A,
    minProperties: number,
    actualPropertyCount: number,
  ): LeafError<MinPropertiesError<A>> =>
    new LeafError(new MinPropertiesError(actual, minProperties, actualPropertyCount))
}

export class MaxPropertiesError<A> implements Actual<A>, ToRoseTree {
  static type = '@typed/io/MaxProperties' as const
  readonly type = MaxPropertiesError.type
  readonly toRoseTree: () => RoseTree<string>

  constructor(
    readonly actual: A,
    readonly maxProperties: number,
    readonly actualPropertyCount: number,
  ) {
    this.toRoseTree = () =>
      RoseTree(
        `Expected ${stringify(
          actual,
        )} maximum of ${maxProperties} properties but found ${actualPropertyCount}`,
      )
  }

  static leaf = <A>(
    actual: A,
    maxProperties: number,
    actualPropertyCount: number,
  ): LeafError<MaxPropertiesError<A>> =>
    new LeafError(new MaxPropertiesError(actual, maxProperties, actualPropertyCount))
}

export class PatternPropertiesError<A, E extends ToRoseTree> implements Actual<A>, ToRoseTree {
  static type = '@typed/io/PatternProperties' as const
  readonly type = PatternPropertiesError.type
  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly actual: A, readonly pattern: string, readonly error: SchemaError<E>) {
    this.toRoseTree = () =>
      RoseTree(`Expected ${stringify(actual)} schema to match schema defined by ${pattern}`, [
        RoseTree(printSchemaError(error)),
      ])
  }

  static leaf = <A, E extends ToRoseTree>(
    actual: A,
    pattern: string,
    error: SchemaError<E>,
  ): LeafError<PatternPropertiesError<A, E>> =>
    new LeafError(new PatternPropertiesError(actual, pattern, error))
}
