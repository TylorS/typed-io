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
  describe(printSchemaError.name, () => {
    describe(LeafError.name)
    describe(CompoundError.name)
    describe(LazyError.name)
    describe(MemberError.name)
    describe(MissingIndexes.name)
    describe(MissingKeys.name)
    describe(NamedError.name)
    describe(NullableError.name)
    describe(OptionalError.name)
    describe(OptionalIndex.name)
    describe(OptionalKey.name)
    describe(RequiredIndex.name)
    describe(RequiredKey.name)
    describe(SumError.name)
    describe(UnexpectedIndexes.name)
    describe(UnexpectedKeys.name)
  })
})
