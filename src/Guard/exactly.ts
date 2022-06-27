import { JsonPrimitive } from 'hkt-ts/Json'

import { Guard } from './Guard'

export const exactly = <A extends JsonPrimitive>(value: A): Guard<A> =>
  Guard((a): a is A => a === value)
