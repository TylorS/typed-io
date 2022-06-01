export interface Lens<A, B> {
  readonly get: (a: A) => B
  readonly set: (b: B) => (a: A) => A
}

export function Lens<A, B>(get: Lens<A, B>['get'], set: Lens<A, B>['set']): Lens<A, B> {
  return {
    get,
    set,
  }
}

export function fromProp<A>() {
  return <K extends keyof A>(key: K): Lens<A, A[K]> =>
    Lens(
      (a) => a[key],
      (b) => (a) => ({ ...a, [key]: b }),
    )
}
