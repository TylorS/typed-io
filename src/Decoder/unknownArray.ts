import { fromGuard } from './fromGuard'

import * as Guard from '@/Guard/Guard'
import { UnknownArrayError } from '@/SchemaError/BuiltinErrors'

export const unknkownArray = fromGuard(Guard.unknownArray, UnknownArrayError.leaf)
