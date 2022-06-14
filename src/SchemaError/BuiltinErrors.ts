/* eslint-disable @typescript-eslint/no-unused-vars */
import { RoseTree } from 'hkt-ts/RoseTree'

import { LeafError } from './SchemaError'

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

export class StringError extends actual(expectedError('string'))('String') {}

export class NumberError extends actual(expectedError('number'))('Number') {}

export class IntegerError extends actual(expectedError('integer'))('Integer') {}

export class NaNError extends actual((_: typeof NaN) =>
  RoseTree(`Expected number but received NaN`),
)('NaN') {}

export class NegativeInfinityError extends actual((_: typeof Infinity) =>
  RoseTree(`Expected number but received -Infinity`),
)('-Infinity') {}

export class PositiveInfinityError extends actual((_: typeof Infinity) =>
  RoseTree(`Expected number but received +Infinity`),
)('+Infinity') {}

export class BooleanError extends actual(expectedError('boolean'))('Boolean') {}

export class UnknownArrayError extends actual(expectedError('Array'))('UnknownArray') {}

export class UnknownRecordError extends actual(expectedError('Record'))('UnknownRecord') {}

export class ConstError<E> implements Actual<unknown>, ToRoseTree {
  static type = '@typed/io/Const' as const
  readonly type = ConstError.type
  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly expected: E, readonly actual: unknown) {
    this.toRoseTree = () =>
      RoseTree(`Expected exactly ${stringify(expected)} but received ${stringify(actual)}`)
  }

  static leaf = <E>(expected: E, actual: unknown) => new LeafError(new ConstError(expected, actual))
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

  static leaf = <E extends ReadonlyArray<any>>(expected: E, actual: unknown) =>
    new LeafError(new EnumError(expected, actual))
}

export class MessageError implements ToRoseTree {
  static type = '@typed/io/Message' as const
  readonly type = MessageError.type

  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly message: string) {
    this.toRoseTree = () => RoseTree(message)
  }

  static leaf = (message: string) => new LeafError(new MessageError(message))
}

export class TagError {
  static type = 'Tag'
  readonly type = 'Tag'
  readonly toTree: () => RoseTree<string>

  constructor(readonly tag: string, readonly members: ReadonlyArray<string>) {
    this.toTree = () =>
      RoseTree(
        `Error(s) found while decoding sum tag ${tag}`,
        members.map((m) => RoseTree(m)),
      )
  }

  static leaf = (tag: string, members: ReadonlyArray<string>) =>
    new LeafError(new TagError(tag, members))
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
}

export class PatternError implements Actual<string>, ToRoseTree {
  static type = '@typed/io/Pattern' as const
  readonly type = PatternError.type
  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly actual: string, readonly pattern: RegExp) {
    this.toRoseTree = () => RoseTree(`Expected ${actual} to match RegExp pattern ${pattern}.`)
  }
}

export class FormatError implements Actual<string>, ToRoseTree {
  static type = '@typed/io/Format' as const
  readonly type = FormatError.type
  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly actual: string, readonly format: StringFormat) {
    this.toRoseTree = () => RoseTree(`Expected ${actual} to match format ${format}.`)
  }
}
