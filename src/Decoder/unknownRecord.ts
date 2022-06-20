import { fromGuard } from './fromGuard'

import * as Guard from '@/Guard/Guard'
import { UnknownRecordError } from '@/SchemaError/BuiltinErrors'

export const unknownRecord = fromGuard(Guard.unknownRecord, UnknownRecordError.leaf)
