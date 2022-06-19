import { pipe } from 'hkt-ts'
import { Both, Right, match } from 'hkt-ts/These'

import { Decoder } from './Decoder'

import { length, pluralWithLength } from '@/SchemaError/Debug'
import { NamedError } from '@/SchemaError/SchemaError'

/**
 * Decoder combinator for providing a default value in the case of failures. In the even of
 * failures, the errors will be wrapped in a
 */
export function withFallback<B>(f: () => B) {
  return <I, E, A>(decoder: Decoder<I, E, A>): Decoder<I, E, A | B> => ({
    decode: (i) =>
      pipe(
        i,
        decoder.decode,
        match(
          (e) =>
            Both(
              new NamedError(
                `Used fallback value due to ${pluralWithLength('error', length(e))} encountered`,
                e,
              ),
              f(),
            ),
          Right,
          Both,
        ),
      ),
  })
}
