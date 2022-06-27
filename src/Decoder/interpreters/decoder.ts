import { DecoderSchema } from '../DecoderSchema'
import { DecoderInterpreter } from '../Interpreter'

import { Register } from '@/internal'

export const DecoderSchemaDecoderInterpereter = Register.make<DecoderInterpreter>((i) =>
  i.add(DecoderSchema, (s) => s.decoder),
)
