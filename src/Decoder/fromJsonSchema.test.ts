import { pipe } from 'hkt-ts'
import * as L from 'hkt-ts/Law'
import { Right } from 'hkt-ts/These'
import { DeepEquals } from 'hkt-ts/Typeclass/Eq'

import { fromJsonSchema } from './fromJsonSchema'

describe(__filename, () => {
  describe('string', () => {
    const baseSchema = {
      type: 'string',
    } as const

    const baseDecoder = fromJsonSchema(baseSchema)

    it('decodes a string', () =>
      pipe(
        L.string(),
        L.toProperty((s) => DeepEquals.equals(baseDecoder.decode(s), Right(s))),
        L.assert,
      ))
  })

  describe('number', () => {
    const baseSchema = {
      type: 'number',
    } as const

    const baseDecoder = fromJsonSchema(baseSchema)

    it('decodes a number', () =>
      pipe(
        L.number(),
        L.toProperty((n) => DeepEquals.equals(baseDecoder.decode(n), Right(n))),
        L.assert,
      ))
  })

  describe('boolean', () => {
    const baseSchema = {
      type: 'boolean',
    } as const

    const baseDecoder = fromJsonSchema(baseSchema)

    it('decodes a boolean', () =>
      pipe(
        L.boolean,
        L.toProperty((b) => DeepEquals.equals(baseDecoder.decode(b), Right(b))),
        L.assert,
      ))
  })

  describe('null', () => {
    const baseSchema = {
      type: 'null',
    } as const

    const baseDecoder = fromJsonSchema(baseSchema)

    it('decodes a null', () =>
      pipe(
        L.constant(null),
        L.toProperty((b) => DeepEquals.equals(baseDecoder.decode(b), Right(b))),
        L.assert,
      ))
  })

  describe('record', () => {
    const baseSchema = {
      type: 'object',
      additionalProperties: {
        type: 'string',
      },
    } as const

    const baseDecoder = fromJsonSchema(baseSchema)

    it('decodes a record', () =>
      pipe(
        L.record(L.string()),
        L.toProperty((b) => DeepEquals.equals(baseDecoder.decode(b), Right(b))),
        L.assert,
      ))
  })

  describe('struct', () => {
    const baseSchema = {
      type: 'object',
      properties: {
        a: {
          type: 'string',
        },
        b: {
          type: 'boolean',
        },
      },
      required: ['a'],
    } as const

    const baseDecoder = fromJsonSchema(baseSchema)

    it('decodes a struct', () =>
      pipe(
        L.struct({ a: L.string(), b: L.boolean }),
        L.toProperty((b) => DeepEquals.equals(baseDecoder.decode(b), Right(b))),
        L.assert,
      ))
  })

  describe('array', () => {
    const baseSchema = {
      type: 'array',
      contains: {
        type: 'string',
      },
    } as const

    const baseDecoder = fromJsonSchema(baseSchema)

    it('decodes a array', () =>
      pipe(
        L.array(L.string()),
        L.toProperty((b) => DeepEquals.equals(baseDecoder.decode(b), Right(b))),
        L.assert,
      ))
  })

  describe('tuple', () => {
    const baseSchema = {
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    } as const

    const baseDecoder = fromJsonSchema(baseSchema)

    it('decodes a tuple', () =>
      pipe(
        L.tuple(L.string(), L.number(), L.boolean),
        L.toProperty((b) => DeepEquals.equals(baseDecoder.decode(b), Right(b))),
        L.assert,
      ))
  })

  describe('unknownArray', () => {
    const baseSchema = {
      type: 'array',
    } as const
    const baseDecoder = fromJsonSchema(baseSchema)

    it('decodes any array', () =>
      pipe(
        L.array(L.unknown),
        L.toProperty((b) => DeepEquals.equals(baseDecoder.decode(b), Right(b))),
        L.assert,
      ))
  })

  describe('unknownRecord', () => {
    const baseSchema = {
      type: 'object',
    } as const
    const baseDecoder = fromJsonSchema(baseSchema)

    it('decodes any record', () =>
      pipe(
        L.record(L.unknown),
        L.toProperty((b) => DeepEquals.equals(baseDecoder.decode(b), Right(b))),
        L.assert,
      ))
  })

  describe('allOf', () => {
    const baseSchema = {
      allOf: [
        {
          type: 'object',
          properties: {
            a: { type: 'string' },
          },
          required: ['a'],
        },
        {
          type: 'object',
          properties: {
            b: { type: 'number' },
          },
          required: ['b'],
        },
      ],
    } as const
    const baseDecoder = fromJsonSchema(baseSchema)

    it('decodes the intersection', () =>
      pipe(
        L.struct({ a: L.string(), b: L.number() }),
        L.toProperty((b) => DeepEquals.equals(baseDecoder.decode(b), Right(b))),
        L.assert,
      ))
  })

  describe('anyOf', () => {
    const baseSchema = {
      anyOf: [
        {
          type: 'object',
          properties: {
            a: { type: 'string' },
          },
          required: ['a'],
        },
        {
          type: 'object',
          properties: {
            b: { type: 'number' },
          },
          required: ['b'],
        },
      ],
    } as const
    const baseDecoder = fromJsonSchema(baseSchema)

    it('decodes the union', () =>
      pipe(
        L.union(L.struct({ a: L.string() }), L.struct({ b: L.number() })),
        L.toProperty((b) => DeepEquals.equals(baseDecoder.decode(b), Right(b))),
        L.assert,
      ))
  })

  describe('oneOf', () => {
    const baseSchema = {
      oneOf: [
        {
          type: 'object',
          properties: {
            a: { type: 'string' },
          },
          required: ['a'],
        },
        {
          type: 'object',
          properties: {
            b: { type: 'number' },
          },
          required: ['b'],
        },
      ],
    } as const

    const baseDecoder = fromJsonSchema(baseSchema)

    it('decodes the union', () =>
      pipe(
        L.union(L.struct({ a: L.string() }), L.struct({ b: L.number() })),
        L.toProperty((b) => DeepEquals.equals(baseDecoder.decode(b), Right(b))),
        L.assert,
      ))
  })
})
