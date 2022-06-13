import { Refinement } from 'hkt-ts/Refinement'

import { Schema } from '@/Schema'

export class IdentitySchema<A> extends Schema<IdentitySchemaCapabilities<A>, never, readonly []> {
  static type = '@typed/io/Identity' as const
  readonly type = IdentitySchema.type
  readonly api!: never

  constructor(readonly refinement: Refinement<unknown, A>) {
    super()
  }
}

/**
 * Intended to be extended by other interpreter implementations via module augmentation
 */ // eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IdentitySchemaCapabilities<A> {}

export const identity = <A>(
  refinement: Refinement<unknown, A>,
): Schema<IdentitySchemaCapabilities<A>, never, readonly []> => new IdentitySchema(refinement)
