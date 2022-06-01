import { Guard } from './Guard'
import { SchemaGuard } from './SchemaGuard'

import { AnySchema, ContinuationSymbol, DecodedOf, hasContinuation } from '@/Schema'
import { SchemaIdentity } from '@/schemas/identity'
import { SchemaRefine } from '@/schemas/refine'

export class GuardInterpreter {
  readonly memoized = new WeakMap<AnySchema, Guard<any>>()
  readonly interpreters: GuardInterpreters

  constructor(options: GuardInterpreterOptions = {}) {
    this.interpreters = options.interpreters ?? new Map()
  }

  readonly toGuard = <S extends AnySchema>(schema: S): Guard<DecodedOf<S>> => {
    if (this.memoized.has(schema)) {
      return this.memoized.get(schema) as Guard<DecodedOf<S>>
    }

    if (this.interpreters.has(schema.type)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const g = this.interpreters.get(schema.type)!(schema)

      this.memoized.set(schema, g)

      return g
    }

    if (hasContinuation(schema)) {
      const g = this.toGuard(schema[ContinuationSymbol])

      this.memoized.set(schema, g)

      return g
    }

    throw new Error(`Unable to create Guard for Schema ${JSON.stringify(schema)}`)
  }

  readonly addInterpreter = <
    K extends
      | {
          readonly type: string
          new (): AnySchema
        }
      | {
          readonly type: string
          new (...args: any): AnySchema
        },
  >(
    K: K,
    f: (a: InstanceType<K>) => Guard<DecodedOf<InstanceType<K>>>,
  ) => {
    this.interpreters.set(K.type, f as any)
  }
}

export interface GuardInterpreterOptions {
  readonly interpreters?: GuardInterpreters
}

export type GuardInterpreters = Map<string, (schema: AnySchema) => Guard<any>>

export const defaultGuardInterpreter = new GuardInterpreter()
export const { toGuard } = defaultGuardInterpreter

addDefaultGuardInterprereters(defaultGuardInterpreter)

export function addDefaultGuardInterprereters(i: GuardInterpreter) {
  addSchemaIdentityGuardInterpreter(i)
  addSchemaGuardGuardInterpreter(i)
  addSchemaRefineGuardInterpreter(i)
}

export function addSchemaIdentityGuardInterpreter({ addInterpreter }: GuardInterpreter) {
  addInterpreter(SchemaIdentity, (i) => ({ is: i.refinement }))
}

export function addSchemaGuardGuardInterpreter({ addInterpreter }: GuardInterpreter) {
  addInterpreter(SchemaGuard, (g) => ({ is: g.is }))
}

export function addSchemaRefineGuardInterpreter({ toGuard, addInterpreter }: GuardInterpreter) {
  addInterpreter(SchemaRefine, (r) => ({
    is: (u): u is unknown => toGuard(r[ContinuationSymbol]).is(u) && r.refinement(u),
  }))
}
