import { These } from 'hkt-ts/These'

import { SchemaError } from '@/SchemaError/SchemaError'

export interface Decoder<I, E, O> {
  readonly decode: (input: I) => These<SchemaError<E>, O>
}

export function Decoder<I, E, O>(decode: Decoder<I, E, O>['decode']): Decoder<I, E, O> {
  return {
    decode,
  }
}
