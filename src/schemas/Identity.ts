import { Refinement } from 'hkt-ts/Refinement'

import { Constructor } from '@/Constructor/Constructor'
import { Decoder } from '@/Decoder/Decoder'
import { Encoder } from '@/Encoder/Encoder'
import { Schema } from '@/Schema'

// eslint-disable-next-line @typescript-eslint/ban-types
export class IdentitySchema<A> extends Schema<
  Decoder<unknown, never, A>,
  Constructor<A, never, A>,
  Encoder<A, A>,
  never,
  {
    readonly refinement: Refinement<unknown, A>
  },
  readonly []
> {
  static type = 'Identity'
  readonly type = IdentitySchema.type
  readonly api = {
    refinement: this.refinement,
  }

  constructor(readonly refinement: Refinement<unknown, A>) {
    super()
  }
}

export const identity = <A>(
  refinement: Refinement<unknown, A>,
): Schema<
  Decoder<unknown, never, A>,
  Constructor<A, never, A>,
  Encoder<A, A>,
  never,
  {
    readonly refinement: Refinement<unknown, A>
  },
  readonly []
> => new IdentitySchema(refinement)
