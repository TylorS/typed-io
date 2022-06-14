import { mapLeft } from 'hkt-ts/These'
import { flow } from 'hkt-ts/function'

import { Decoder } from './Decoder'

import { NamedError } from '@/SchemaError/SchemaError'

export const named =
  (name: string) =>
  <I, E, A>(decoder: Decoder<I, E, A>): Decoder<I, E, A> => ({
    decode: flow(
      decoder.decode,
      mapLeft((e) => new NamedError(name, e)),
    ),
  })
