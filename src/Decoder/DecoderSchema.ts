import * as Decoder from './Decoder'

import {
  AnyAnnotations,
  AnyCapabilities,
  AnySchemaWith,
  ContinuationSymbol,
  HasContinuation,
  Schema,
} from '@/Schema'

export const DECODER = '@typed/io/Decoder' as const
export type DECODER = typeof DECODER

export type AnyDecoderCapability =
  | DecoderCapability<any, any, any>
  | DecoderCapability<any, never, any>

export type DecoderOf<A> = A extends AnySchemaWith<infer Capabilities>
  ? DECODER extends keyof Capabilities
    ? Capabilities[DECODER]
    : never
  : never

export type DecoderInputOf<T> = Decoder.InputOf<DecoderOf<T>>
export type DecoderErrorOf<T> = Decoder.ErrorOf<DecoderOf<T>>
export type DecoderOutputOf<T> = Decoder.OutputOf<DecoderOf<T>>

export interface DecoderCapability<I, E, O> {
  readonly [DECODER]: Decoder.Decoder<I, E, O>
}

export class DecoderSchema<
    C extends AnyCapabilities,
    Api,
    Annotations extends AnyAnnotations,
    I,
    E,
    O,
  >
  extends Schema<Omit<C, DECODER> & DecoderCapability<I, E, O>, Api, Annotations>
  implements HasContinuation
{
  static type = DECODER
  readonly type = DECODER

  get api() {
    return this.schema.api
  }

  readonly [ContinuationSymbol] = this.schema

  constructor(
    readonly schema: Schema<C, Api, Annotations>,
    readonly decoder: Decoder.Decoder<I, E, O>,
  ) {
    super()
  }
}

export const decoder =
  <I, E, O>(Decoder: Decoder.Decoder<I, E, O>) =>
  <C extends AnyCapabilities, Api, Annotations extends AnyAnnotations>(
    schema: Schema<C, Api, Annotations>,
  ): Schema<Omit<C, DECODER> & DecoderCapability<I, E, O>, Api, Annotations> =>
    new DecoderSchema(schema, Decoder)
