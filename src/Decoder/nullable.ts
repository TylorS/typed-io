import { pipe } from 'hkt-ts'
import { Right } from 'hkt-ts/Either'
import { mapLeft } from 'hkt-ts/These'

import { Decoder } from './Decoder'
import { fromRefinment } from './fromRefinement'

import { isNull } from '@/Guard/Guard'
import { MessageError } from '@/SchemaError/BuiltinErrors'
import { NullableError } from '@/SchemaError/SchemaError'

const null_ = fromRefinment(isNull, (e) =>
  MessageError.leaf(`Expected null but received ${JSON.stringify(e)}`),
)

export { null_ as null }

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
