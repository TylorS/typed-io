import { AnyGuard } from './Guard'
import { AnyGuardCapability, GuardOf } from './GuardSchema'

import { AnySchemaConstructorWith, AnySchemaWith } from '@/Schema'
import { Register, makeSchemaInterpreter } from '@/internal'

export class GuardInterpreter {
  readonly interpreter = makeSchemaInterpreter<AnyGuardCapability, AnyGuard>('Guard')

  constructor(...classes: ReadonlyArray<new () => Register<GuardInterpreter>>) {
    for (const klass of classes) {
      new klass().register(this)
    }
  }

  readonly addGuardInterpreter = <C extends AnySchemaConstructorWith<AnyGuardCapability>>(
    constructor: C,
    f: (instance: InstanceType<C>) => GuardOf<typeof instance>,
  ): void => this.interpreter.add(constructor, f)

  readonly toGuard = <S extends AnySchemaWith<AnyGuardCapability>>(schema: S): GuardOf<S> =>
    this.interpreter.interpret(schema) as GuardOf<S>
}
