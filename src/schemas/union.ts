import { Cast } from 'ts-toolbelt/out/Any/Cast'

import { AnyAnnotation } from '@/Annotation/Annotation'
import {
  AnnotationsOf,
  AnySchema,
  DecodedOf,
  DecoderErrorOf,
  DecoderInputOf,
  EncodedOf,
  Schema,
} from '@/Schema'

export type UnionApi<SS extends ReadonlyArray<AnySchema>> = { readonly members: Readonly<SS> }

export class SchemaUnion<SS extends ReadonlyArray<AnySchema>> extends Schema<
  DecoderInputOf<SS[number]>,
  DecoderErrorOf<SS[number]>,
  DecodedOf<SS[number]>,
  EncodedOf<SS[number]>,
  never,
  EncodedOf<SS[number]>,
  UnionApi<SS>,
  UnionAnnotations<SS>
> {
  static type = 'Union'
  readonly type = SchemaUnion.type
  readonly api: UnionApi<SS>

  constructor(readonly members: SS) {
    super()

    this.api = {
      members,
    }
  }
}

export function union<SS extends ReadonlyArray<AnySchema>>(
  ...schemas: SS
): Schema<
  DecoderInputOf<SS[number]>,
  DecoderErrorOf<SS[number]>,
  DecodedOf<SS[number]>,
  EncodedOf<SS[number]>,
  never,
  EncodedOf<SS[number]>,
  UnionApi<SS>,
  UnionAnnotations<SS>
> {
  return new SchemaUnion(schemas)
}

export type UnionAnnotations<
  SS extends ReadonlyArray<any>,
  R extends ReadonlyArray<any> = [],
> = SS extends readonly [infer Head, ...infer Tail]
  ? UnionAnnotations<
      Tail,
      [...R, ...Cast<AnnotationsOf<Cast<Head, AnySchema>>, ReadonlyArray<AnyAnnotation>>]
    >
  : R
