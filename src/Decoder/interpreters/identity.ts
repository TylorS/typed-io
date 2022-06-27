import { Decoder } from '../Decoder'
import { DECODER } from '../DecoderSchema'
import { DecoderInterpreter } from '../Interpreter'
import { fromRefinement } from '../fromRefinement'
import { RefineError } from '../refine'

import { Register } from '@/internal'
import { IdentitySchema } from '@/schemas/core/identity'

declare module '@/schemas/core/identity' {
  export interface IdentitySchemaCapabilities<A> {
    readonly [DECODER]: Decoder<unknown, RefineError<unknown, A>, A>
  }
}

export const IdentitySchemaDecoderInterpereter = Register.make<DecoderInterpreter>((i) =>
  i.add(IdentitySchema, (s) =>
    fromRefinement(s.refinement, (a) => new RefineError(a, s.refinement, s.refinement.name)),
  ),
)
