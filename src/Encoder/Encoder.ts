export interface Encoder<I, O> {
  readonly encode: (i: I) => O
}
