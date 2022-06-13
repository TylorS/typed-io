import { pipe } from 'hkt-ts'
import { Refinement } from 'hkt-ts/Refinement'
import { RoseTree } from 'hkt-ts/RoseTree'

import { Decoder } from './Decoder'
import { compose } from './compose'
import { fromRefinment } from './fromRefinement'

import { ToRoseTree } from '@/SchemaError/BuiltinErrors'

export const refine =
  <A, B extends A>(
    refinement: Refinement<A, B>,
    refinementName: string = refinement.name || 'refinement',
  ) =>
  <I, E>(decoder: Decoder<I, E, A>): Decoder<I, E | RefineError<A, B>, B> =>
    pipe(
      decoder,
      compose(fromRefinment(refinement, (a) => new RefineError(a, refinement, refinementName))),
    )

export class RefineError<A, B extends A> implements ToRoseTree {
  static type = '@typed/io/RefineError' as const
  readonly type = RefineError.type

  constructor(
    readonly input: A,
    readonly refinement: Refinement<A, B>,
    readonly refinementName: string,
  ) {}

  readonly toRoseTree = (): RoseTree<string> =>
    RoseTree(
      `Unable to refine ${JSON.stringify(this.input, null, 2)} to expected value defined by ${
        this.refinementName
      }.`,
    )
}
