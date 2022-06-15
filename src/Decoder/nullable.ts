import { pipe } from 'hkt-ts'
import { Right } from 'hkt-ts/Either'
import { mapLeft } from 'hkt-ts/These'

import { Decoder } from './Decoder'

import { isNull } from '@/Guard/Guard'
import { NullableError } from '@/SchemaError/SchemaError'

export const nullable = <I, E, O>(decoder: Decoder<I, E, O>): Decoder<I | null, E, O | null> => ({
  decode: (i) =>
    isNull(i)
      ? Right(i)
      : pipe(
          i,
          decoder.decode,
          mapLeft((e) => new NullableError(e)),
        ),
})
