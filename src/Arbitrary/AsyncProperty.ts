export interface AsyncPropertyTest<A> {
  readonly async: true
  readonly property: (
    fc: typeof import('fast-check'),
  ) => import('fast-check').IAsyncProperty<[A]> | import('fast-check').IAsyncPropertyWithHooks<[A]>
}

export function AsyncPropertyTest<A>(
  property: (
    fc: typeof import('fast-check'),
  ) => import('fast-check').IAsyncProperty<[A]> | import('fast-check').IAsyncPropertyWithHooks<[A]>,
): AsyncPropertyTest<A> {
  return {
    async: true,
    property,
  }
}
