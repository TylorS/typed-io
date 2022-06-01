import { Refinement } from 'hkt-ts/Refinement'

import { Schema } from '@/Schema'

// eslint-disable-next-line @typescript-eslint/ban-types
export class SchemaIdentity<A> extends Schema<
  unknown,
  never,
  A,
  A,
  never,
  A,
  {
    readonly refinement: Refinement<unknown, A>
  },
  readonly []
> {
  static type = 'Identity'
  readonly type = SchemaIdentity.type
  readonly api = {
    refinement: this.refinement,
  }

  constructor(readonly refinement: Refinement<unknown, A>) {
    super()
  }
}

export const identity = <A>(
  refinement: Refinement<unknown, A>,
): Schema<unknown, never, A, A, never, A, unknown, readonly []> => new SchemaIdentity(refinement)
