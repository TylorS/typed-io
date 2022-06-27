import { ReadonlyRecord } from 'hkt-ts/Record'

import { Guard, GuardHKT } from './Guard'
import { isUnknownRecord } from './record'
import { guardSharedConstraints } from './shared'

import { SharedConstraints } from '@/Constraints/shared'

export const sum =
  <T extends ReadonlyRecord<string, any>>(constraints?: SharedConstraints<GuardHKT, T>) =>
  <Tag extends keyof T>(tag: Tag) =>
  <Guards extends SumGuards<T, Tag>>(guards: Guards): Guard<T> => ({
    is: guardSharedConstraints(
      isUnknownRecord,
      constraints,
      (i): i is T => tag in i && guards[i[tag] as keyof Guards].is(i),
    ),
  })

export type SumGuards<T, Tag extends keyof T> = {
  readonly [K in Extract<T[Tag], PropertyKey>]: FindSumGuard<T, Tag, K>
}

export type FindSumGuard<T, Tag extends keyof T, K extends T[Tag]> = T extends {
  readonly [_ in Tag]: K
}
  ? Guard<T>
  : never
