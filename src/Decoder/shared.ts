import { pipe } from 'hkt-ts'
import { isNonEmpty } from 'hkt-ts/Array'
import { Refinement } from 'hkt-ts/Refinement'
import { Left, Right, These } from 'hkt-ts/These'
import { DeepEquals } from 'hkt-ts/Typeclass/Eq'

import { Decoder, DecoderHKT } from './Decoder'
import { named } from './named'
import { withFallback } from './withFallback'

import {
  GetSharedError,
  GetSharedType,
  OmitJsonSchemaOnly,
  SharedConstraints,
} from '@/Constraints/shared'
import { ConstError, EnumError } from '@/SchemaError/BuiltinErrors'
import { SchemaError, makeSchemaErrorAssociative } from '@/SchemaError/SchemaError'

type SharedError<T extends ReadonlyArray<any>, E = never> = T extends readonly [
  readonly [any, (arg: any) => SchemaError<infer Next>],
  ...infer Tail,
]
  ? SharedError<Tail, E | Next>
  : E

export const decodeSharedConstraints = <
  A,
  E,
  Additional extends ReadonlyArray<readonly [Refinement<A, any>, (u: A) => SchemaError<any>]> = [],
  Const extends A = never,
  Enum extends ReadonlyArray<A> = never,
  Default extends A = never,
>(
  base: Refinement<unknown, A>,
  baseError: (u: unknown) => SchemaError<E>,
  additionalRefinments: Additional = [] as unknown as Additional,
  constraints?: OmitJsonSchemaOnly<SharedConstraints<DecoderHKT, Const, Enum, Default>>,
): Decoder<
  unknown,
  GetSharedError<E, Const, Enum> | SharedError<Additional>,
  GetSharedType<Const, Enum, A | Default>
> => {
  type R = GetSharedType<Const, Enum, A | Default>

  const decode = (
    u: unknown,
  ): These<
    SchemaError<E | SharedError<Additional> | GetSharedError<E, Const, Enum>>,
    GetSharedType<Const, Enum, A | Default>
  > => {
    if (!base(u)) {
      return Left(baseError(u))
    }

    const errors = additionalRefinments.flatMap(([refinement, refinmentError]) =>
      !refinement(u as A) ? [refinmentError(u as A)] : [],
    )

    if (isNonEmpty(errors)) {
      return Left(errors.reduce(makeSchemaErrorAssociative<any>('Refinements').concat))
    }

    if (!constraints) {
      return Right(u as R)
    }

    if ('const' in constraints) {
      return DeepEquals.equals(constraints.const, u)
        ? Right(u as R)
        : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          Left(ConstError.leaf(constraints.const!, u) as any)
    }

    if (constraints.enum !== undefined) {
      return constraints.enum.some((x) => DeepEquals.equals(x, u))
        ? Right(u as R)
        : Left(EnumError.leaf(constraints.enum, u) as any)
    }

    return Right(u as R)
  }

  let decoder: Decoder<
    unknown,
    SharedError<Additional> | GetSharedError<E, Const, Enum>,
    GetSharedType<Const, Enum, A | Default>
  > = {
    decode,
  }

  if (!constraints) {
    return decoder
  }

  if ('default' in constraints) {
    decoder = pipe(
      decoder,
      withFallback(() => constraints.default as R),
    )
  }

  if ('title' in constraints) {
    decoder = pipe(decoder, named(constraints.title as string))
  }

  return decoder
}
