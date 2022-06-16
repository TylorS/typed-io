import { isBoolean } from 'hkt-ts/boolean'

import { Decoder, DecoderHKT } from './Decoder'
import { decodeSharedConstraints } from './shared'

import {
  GetSharedError,
  GetSharedType,
  OmitJsonSchemaOnly,
  SharedConstraints,
} from '@/Constraints/shared'
import { BooleanError } from '@/SchemaError/BuiltinErrors'

export interface BooleanConstraints<
  Const extends boolean = never,
  Enum extends ReadonlyArray<boolean> = never,
  Default extends boolean = never,
> extends OmitJsonSchemaOnly<SharedConstraints<DecoderHKT, Const, Enum, Default>> {}

export const boolean = <
  Const extends boolean = never,
  Enum extends ReadonlyArray<boolean> = never,
  Default extends boolean = never,
>(
  constraints?: BooleanConstraints<Const, Enum, Default>,
): Decoder<
  unknown,
  GetSharedError<BooleanError, Const, Enum>,
  GetSharedType<Const, Enum, boolean | Default>
> => decodeSharedConstraints(isBoolean, BooleanError.leaf, [], constraints)
