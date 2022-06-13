import {
  AnyAnnotations,
  AnyCapabilities,
  ContinuationSymbol,
  HasContinuation,
  Schema,
} from '@/Schema'
import { memoizeOnce } from '@/internal'

/**
 * Lazily compute the result of a Schema, inheriting it's
 */
export const lazy = <C extends AnyCapabilities, Api, Annotations extends AnyAnnotations>(
  f: () => Schema<C, Api, Annotations>,
): Schema<C, Api, Annotations> => new LazySchema(f)

export class LazySchema<C extends AnyCapabilities, Api, Annotations extends AnyAnnotations>
  extends Schema<C, Api, Annotations>
  implements HasContinuation
{
  static type = '@typed/io/Lazy' as const
  readonly type = LazySchema.type

  get api() {
    return this.getMemoized().api
  }

  get [ContinuationSymbol]() {
    return this.getMemoized()
  }

  protected getMemoized = memoizeOnce(this.f)

  constructor(readonly f: () => Schema<C, Api, Annotations>) {
    super()
  }
}
