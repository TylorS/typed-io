import { Just, Maybe, Nothing, isJust } from 'hkt-ts/Maybe'
import { Equals } from 'ts-toolbelt/out/Any/Equals'

import {
  AnyCapabilities,
  AnySchema,
  AnySchemaConstructorWith,
  AnySchemaWith,
  ContinuationSymbol,
  hasContinuation,
} from './Schema'
import type { LazySchema } from './schemas/core/lazy'

export class Register<I> {
  constructor(readonly register: (interpreter: I) => void) {}

  static make = <I>(f: (interpreter: I) => void) => new Register(f)
}

export function makeSchemaInterpreter<
  C extends AnyCapabilities,
  A,
  Args extends ReadonlyArray<any> = readonly [],
>(entityName: string) {
  const memoized = new WeakMap<AnySchema, A>()
  const interpreters = new Map<AnySchema['type'], (instance: AnySchema) => A>()

  const add = <Constructor extends AnySchemaConstructorWith<C>>(
    constructor: Constructor,
    f: (instance: InstanceType<Constructor>, ...args: Args) => A,
  ): void => {
    interpreters.set(constructor.type, f as any)
  }

  const interpret = <S extends AnySchemaWith<C>>(schema: S, ...args: Args): A => {
    if (memoized.has(schema)) {
      return memoized.get(schema) as A
    }

    // Special support for Lazy Schema to avoid recomputation of internal schemas
    if (schema.type === '@typed/io/Lazy') {
      const g = interpret((schema as any as LazySchema<C, any, any>).f(), ...args)

      memoized.set(schema, g)

      return g
    }

    const interpereter = interpreters.get(schema.type)

    if (interpereter) {
      const a = interpereter(schema)

      memoized.set(schema, a)

      return a
    }

    if (hasContinuation(schema)) {
      return interpret(schema[ContinuationSymbol], ...args)
    }

    throw new Error(
      `Unable to create ${entityName} for Schema: ${
        schema.constructor.name || JSON.stringify(schema)
      }`,
    )
  }

  return {
    add,
    interpret,
  } as const
}

export abstract class BaseInterpreter<C extends AnyCapabilities, Output> {
  readonly interpreter: SchemaInterpreter<C, Output> = makeSchemaInterpreter<C, Output>(
    this.entityName,
  )
  readonly add = this.interpreter.add

  constructor(readonly entityName: string) { }
}

export const interpreter = <C extends AnyCapabilities, Output>(entityName: string) =>
  class Interpreter<R extends BaseInterpreter<C, Output>> extends BaseInterpreter<C, Output> {
    constructor(...registrations: ReadonlyArray<Register<R>>) {
      super(entityName)

      for (const r of registrations) {
        r.register(this as any as R)
      }
    }
  }

// eslint-disable-next-line @typescript-eslint/no-unused-vars,prettier/prettier
export type SchemaInterpreter<C extends AnyCapabilities, A> = ReturnType<typeof makeSchemaInterpreter<C, A>>

export const memoizeOnce = <A>(f: () => A) => {
  let value: Maybe<A> = Nothing

  return (): A => {
    if (isJust(value)) {
      return value.value
    }

    const x = f()

    value = Just(x)

    return x
  }
}

export type DropNever<T> = { readonly [K in keyof T as {
  0: K
  1: never
}[ Equals<never, T[K]> ]]: T[K] }
