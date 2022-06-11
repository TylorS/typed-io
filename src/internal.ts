import {
  AnyCapabilities,
  AnySchema,
  AnySchemaConstructorWith,
  AnySchemaWith,
  ContinuationSymbol,
  hasContinuation,
} from './Schema'

export class Register<I> {
  constructor(readonly register: (interpreter: I) => void) {}

  static make = <I>(f: (interpreter: I) => void) => new Register(f)
}

export function makeSchemaInterpreter<C extends AnyCapabilities, A>(entityName: string) {
  const memoized = new WeakMap<AnySchema, A>()
  const interpreters = new Map<AnySchema['type'], (instance: AnySchema) => A>()

  const add = <Constructor extends AnySchemaConstructorWith<C>>(
    constructor: Constructor,
    f: (instance: InstanceType<Constructor>) => A,
  ): void => {
    interpreters.set(constructor.type, f as any)
  }

  const interpret = <S extends AnySchemaWith<C>>(schema: S): A => {
    if (memoized.has(schema)) {
      return memoized.get(schema) as A
    }

    const interpereter = interpreters.get(schema.type)

    if (interpereter) {
      const a = interpereter(schema)

      memoized.set(schema, a)

      return a
    }

    if (hasContinuation(schema)) {
      return interpret(schema[ContinuationSymbol])
    }

    throw new Error(
      `Unable to create ${entityName} for Schema: ${
        schema.constructor.name ?? JSON.stringify(schema)
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
  readonly interpret = this.interpreter.interpret

  constructor(readonly entityName: string) {}
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
