import { AnyGuard } from './Guard'
import { AnyGuardCapability } from './GuardSchema'

import { interpreter } from '@/internal'

export class GuardInterpreter extends interpreter<AnyGuardCapability, AnyGuard>(
  'Guard',
)<GuardInterpreter> {}
