import { absurd, constTrue } from 'hkt-ts'
import { Refinement } from 'hkt-ts/Refinement'

import { fromRefinment } from './fromRefinement'

const unknown_ = fromRefinment(constTrue as Refinement<unknown, unknown>, absurd)

export { unknown_ as unknown }
