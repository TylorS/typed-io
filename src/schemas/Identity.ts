import { Refinement } from 'hkt-ts/Refinement'

import { Schema } from '@/Schema'

export class SchemaIdentity<A> extends Schema<unknown, never, A, A, never, A, unknown, []> {
  static type = 'Identity'
  readonly type = SchemaIdentity.type

  constructor(readonly refinement: Refinement<unknown, A>) {
    super()
  }

  get api() {
    return {}
  }
}
