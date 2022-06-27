import * as Decoder from '../Decoder'
import { AnyDecoderCapability, DECODER } from '../DecoderSchema'
import { DecoderInterpreter } from '../Interpreter'
import { compose } from '../compose'

import { AnyCapabilities, AnySchemaWith } from '@/Schema'
import { Register } from '@/internal'
import { ComposeSchema } from '@/schemas/core/compose'

declare module '@/schemas/core/compose' {
  export interface ComposeCapabilities<C1 extends AnyCapabilities, C2 extends AnyCapabilities> {
    readonly [DECODER]: DECODER extends keyof C1 & keyof C2
      ? [C1[DECODER]] extends [Decoder.Decoder<infer I1, infer E1, infer A>]
        ? [C2[DECODER]] extends [Decoder.Decoder<A, infer E2, infer B>]
          ? Decoder.Decoder<I1, E1 | E2, B>
          : never
        : never
      : never
  }
}

export const ComposeSchemaDecoderInterpereter = Register.make<DecoderInterpreter>((i) =>
  i.add(ComposeSchema, (s) =>
    compose(i.toDecoder(s.right as AnySchemaWith<AnyDecoderCapability>))(
      i.toDecoder(s.left as AnySchemaWith<AnyDecoderCapability>),
    ),
  ),
)
