import { These } from 'hkt-ts/These'

import { SchemaError } from '@/SchemaError/SchemaError'

export interface Constructor<I, E, O> {
  readonly construct: (input: I) => These<SchemaError<E>, O>
}

export function Constructor<I, E, O>(
  construct: Constructor<I, E, O>['construct'],
): Constructor<I, E, O> {
  return {
    construct,
  }
}
