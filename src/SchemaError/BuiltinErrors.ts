/* eslint-disable @typescript-eslint/no-unused-vars */
import { RoseTree } from 'hkt-ts/RoseTree'

import { LeafError } from './SchemaError'

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
      static type = type
      readonly type = type
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
  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly expected: E, readonly actual: unknown) {
    this.toRoseTree = () =>
      RoseTree(`Expected ${stringify(expected)} but received ${stringify(actual)}`)
  }

  static leaf = <E>(expected: E, actual: unknown) => new LeafError(new ConstError(expected, actual))
}

export class EnumError<E extends ReadonlyArray<any>> implements Actual<unknown>, ToRoseTree {
  readonly toRoseTree: () => RoseTree<string>

  constructor(readonly expected: E, readonly actual: unknown) {
    this.toRoseTree = () =>
      RoseTree(
        `Expected one of [ ${expected
          .map(stringify)
          .join(', ')} ] but received the following ${stringify(actual)}`,
      )
  }

  static leaf = <E extends ReadonlyArray<any>>(expected: E, actual: unknown) =>
    new LeafError(new EnumError(expected, actual))
}

export class MessageError implements ToRoseTree {
  static type = 'Message'
  readonly type = 'Message'

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
        `error(s) found while decoding sum tag ${stringify(tag)}`,
        members.map((m) => RoseTree(stringify(m))),
      )
  }

  static leaf = (tag: string, members: ReadonlyArray<string>) =>
    new LeafError(new TagError(tag, members))
}

export class InvalidDateError extends actual(expectedError('ISO8601-formatted Date String'))(
  'InvalidDate',
) {}
