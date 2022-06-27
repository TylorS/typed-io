export interface PropertyTest<A> {
  readonly async: false
  readonly property: (
    fc: typeof import('fast-check'),
  ) => import('fast-check').IProperty<[A]> | import('fast-check').IPropertyWithHooks<[A]>
}

export function PropertyTest<A>(
  property: (
    fc: typeof import('fast-check'),
  ) => import('fast-check').IProperty<[A]> | import('fast-check').IPropertyWithHooks<[A]>,
): PropertyTest<A> {
  return {
    async: false,
    property,
  }
}
