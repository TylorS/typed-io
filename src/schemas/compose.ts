import { AnyAnnotations, AnyCapabilities, Schema } from '@/Schema'

export class ComposeSchema<
  C1 extends AnyCapabilities,
  Api1,
  Annotations extends AnyAnnotations,
  C2 extends AnyCapabilities,
  Api2,
  Annotations2 extends AnyAnnotations,
> extends Schema<ComposeCapabilities<C1, C2>, Api2, readonly [...Annotations, ...Annotations2]> {
  static type = '@typed/io/Compose' as const
  readonly type = ComposeSchema.type

  get api() {
    return this.right.api
  }

  constructor(
    readonly left: Schema<C1, Api1, Annotations>,
    readonly right: Schema<C2, Api2, Annotations2>,
  ) {
    super()
  }
}

// Intended to be extended by other interpreter implementations via module augmentation
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ComposeCapabilities<C1 extends AnyCapabilities, C2 extends AnyCapabilities> {}

/**
 * Compose together 2 Schemas
 */
export const compose =
  <C2 extends AnyCapabilities, Api2, Annotations2 extends AnyAnnotations>(
    right: Schema<C2, Api2, Annotations2>,
  ) =>
  <C1 extends AnyCapabilities, Api1, Annotations extends AnyAnnotations>(
    left: Schema<C1, Api1, Annotations>,
  ): Schema<ComposeCapabilities<C1, C2>, Api2, readonly [...Annotations, ...Annotations2]> =>
    new ComposeSchema(left, right)
