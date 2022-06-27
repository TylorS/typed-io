import { absurd, constTrue } from 'hkt-ts'
import { Refinement } from 'hkt-ts/Refinement'

import { Decoder } from './Decoder'
import { fromRefinement } from './fromRefinement'

const unknown_ = fromRefinement(constTrue as Refinement<unknown, unknown>, absurd) as Decoder<
  unknown,
  never,
  unknown
>

export { unknown_ as unknown }
