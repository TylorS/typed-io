import { constVoid } from 'hkt-ts'

import { printSchemaError } from './Debug'
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
  SumError,
  UnexpectedIndexes,
  UnexpectedKeys,
} from './SchemaError'

describe.skip(__filename, () => {
  describe.skip(printSchemaError.name, () => {
    describe.skip(LeafError.name, constVoid)
    describe.skip(CompoundError.name, constVoid)
    describe.skip(LazyError.name, constVoid)
    describe.skip(MemberError.name, constVoid)
    describe.skip(MissingIndexes.name, constVoid)
    describe.skip(MissingKeys.name, constVoid)
    describe.skip(NamedError.name, constVoid)
    describe.skip(NullableError.name, constVoid)
    describe.skip(OptionalError.name, constVoid)
    describe.skip(OptionalIndex.name, constVoid)
    describe.skip(OptionalKey.name, constVoid)
    describe.skip(RequiredIndex.name, constVoid)
    describe.skip(RequiredKey.name, constVoid)
    describe.skip(SumError.name, constVoid)
    describe.skip(UnexpectedIndexes.name, constVoid)
    describe.skip(UnexpectedKeys.name, constVoid)
  })
})
