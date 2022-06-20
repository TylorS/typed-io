import { pipe } from 'hkt-ts'
import { makeAssociative } from 'hkt-ts/Array'
import * as These from 'hkt-ts/These'

import { Decoder, DecoderHKT, ErrorOf, OutputOf } from './Decoder'
import { decodeSharedConstraints } from './shared'

import { GetSharedError, OmitJsonSchemaOnly } from '@/Constraints/shared'
import * as CT from '@/Constraints/tuple'
import { ConstError, EnumError, UnknownArrayError } from '@/SchemaError/BuiltinErrors'
import {
  MissingIndexes,
  SchemaError,
  UnexpectedIndexes,
  makeSchemaErrorAssociative,
} from '@/SchemaError/SchemaError'

export interface TupleConstraints<A extends ReadonlyArray<any>>
  extends OmitJsonSchemaOnly<CT.TupleConstraints<DecoderHKT, A>> {}

export type TupleErrors<E, O extends ReadonlyArray<any>> =
  | E
  | UnknownArrayError
  | ConstError<O>
  | EnumError<ReadonlyArray<O>>

type UnknownDecoder = Decoder<unknown, any, any> | Decoder<unknown, never, any>

export type MemberErrors<Members extends ReadonlyArray<UnknownDecoder>> = {
  readonly [K in keyof Members]: ErrorOf<Members[K]>
}[number]

export type MemberOutput<Members extends ReadonlyArray<UnknownDecoder>> = {
  readonly [K in keyof Members]: OutputOf<Members[K]>
}

export const tuple = <
  Members extends ReadonlyArray<Decoder<unknown, any, any> | Decoder<unknown, never, any>>,
>(
  members: Members,
  constraints?: TupleConstraints<MemberOutput<Members>>,
): Decoder<
  unknown,
  GetSharedError<
    UnknownArrayError | MemberErrors<Members>,
    MemberOutput<Members>,
    ReadonlyArray<MemberOutput<Members>>
  >,
  MemberOutput<Members>
> => {
  const { concat } = These.makeAssociative(
    makeSchemaErrorAssociative<any>(''),
    makeAssociative<any>(),
  )
  const memberLength = members.length

  return decodeSharedConstraints(
    (x: unknown): x is ReadonlyArray<unknown> => Array.isArray(x),
    UnknownArrayError.leaf,
    [],
    constraints,
    (
      u,
    ): These.These<
      SchemaError<
        GetSharedError<
          UnknownArrayError | MemberErrors<Members>,
          MemberOutput<Members>,
          ReadonlyArray<MemberOutput<Members>>
        >
      >,
      MemberOutput<Members>
    > => {
      if (u.length < memberLength) {
        return These.Left(new MissingIndexes(members.slice(u.length).map((_, i) => i + u.length)))
      }

      const output = members.map((d, i) =>
        pipe(
          d.decode(u[i]),
          These.map((x): ReadonlyArray<any> => [x]),
        ),
      )

      if (u.length > memberLength) {
        output.push(
          These.Left(
            new UnexpectedIndexes(u.slice(members.length).map((_, i) => i + memberLength)),
          ),
        )
      }

      return output.reduce(concat) as any
    },
  )
}
