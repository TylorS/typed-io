import { pipe } from 'hkt-ts'
import { Both, Right, match } from 'hkt-ts/These'

import { Decoder } from './Decoder'

import { NamedError } from '@/SchemaError/SchemaError'

export function withFallback<B>(f: () => B) {
  return <I, E, A>(decoder: Decoder<I, E, A>): Decoder<I, E, A | B> => ({
    decode: (i) =>
      pipe(
        i,
        decoder.decode,
        match((e) => Both(new NamedError(`Used Fallback`, e), f()), Right, Both),
      ),
  })
}
