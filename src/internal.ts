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
