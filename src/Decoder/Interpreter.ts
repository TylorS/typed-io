import { AnyDecoder } from './Decoder'
import { AnyDecoderCapability, DecoderOf } from './DecoderSchema'

import { AnySchemaWith } from '@/Schema'
import { interpreter } from '@/internal'

export class DecoderInterpreter extends interpreter<AnyDecoderCapability, AnyDecoder>(
  'Decoder',
)<DecoderInterpreter> {
  readonly toDecoder = <S extends AnySchemaWith<AnyDecoderCapability>>(schema: S) =>
    this.interpreter.interpret(schema) as DecoderOf<S>
}
