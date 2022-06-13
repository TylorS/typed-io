import { AnyGuard } from './Guard'
import { AnyGuardCapability, GuardOf } from './GuardSchema'

import { AnySchemaWith } from '@/Schema'
import { interpreter } from '@/internal'

export class GuardInterpreter extends interpreter<AnyGuardCapability, AnyGuard>(
  'Guard',
)<GuardInterpreter> {
  readonly toGuard = <S extends AnySchemaWith<AnyGuardCapability>>(schema: S) =>
    this.interpreter.interpret(schema) as GuardOf<S>
}
