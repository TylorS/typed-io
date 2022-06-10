import { isBoolean } from 'hkt-ts/boolean'

import { fromRefinment } from './fromRefinement'

import { isFalse, isTrue } from '@/Guard/Guard'

export const boolean = fromRefinment(isBoolean)

const true_ = fromRefinment(isTrue)
const false_ = fromRefinment(isFalse)

export { true_ as true, false_ as false }
