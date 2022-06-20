import { Branded, HKT } from 'hkt-ts'
import { NonNegativeInteger } from 'hkt-ts/number'
import { Equals } from 'ts-toolbelt/out/Any/Equals'

import { GetSharedType, SharedConstraints } from './shared'

export interface StringConstraints<
  T extends HKT,
  Const extends string = never,
  Enum extends ReadonlyArray<string> = never,
  Format extends StringFormat = never,
> extends SharedConstraints<T, Const, Enum, string> {
  readonly minLength?: NonNegativeInteger
  readonly maxLength?: NonNegativeInteger
  readonly format?: Format
  readonly pattern?: RegExp
  readonly contentEncoding?: string
  readonly contentMediaType?: string
}

export type StringFormat =
  | 'date-time'
  | 'time'
  | 'date'
  | 'duration'
  | 'email'
  | 'idn-email'
  | 'hostname'
  | 'idn-hostname'
  | 'ipv4'
  | 'ipv6'
  | 'uuid'
  | 'uri'
  | 'uri-reference'
  | 'iri'
  | 'iri-reference'
  | 'json-pointer'
  | 'relative-json-pointer'
  | 'regex'

export type DateTime = Branded.Branded<'DateTime', string>
export const DateTime = Branded.Branded<DateTime>()

export type DateString = Branded.Branded<'DateString', string>
export const DateString = Branded.Branded<DateString>()

export type TimeString = Branded.Branded<'TimeString', string>
export const Time = Branded.Branded<TimeString>()

export type Duration = Branded.Branded<'Duration', string>
export const Duration = Branded.Branded<Duration>()

export type Email = Branded.Branded<'Email', string>
export const Email = Branded.Branded<Email>()

export type IdnEmail = Branded.Branded<'IdnEmail', string>
export const IdnEmail = Branded.Branded<IdnEmail>()

export type Hostname = Branded.Branded<'Hostname', string>
export const Hostname = Branded.Branded<Hostname>()

export type IdnHostname = Branded.Branded<'IdnHostname', string>
export const IdnHostname = Branded.Branded<IdnHostname>()

export type Ipv4 = Branded.Branded<'Ipv4', string>
export const Ipv4 = Branded.Branded<Ipv4>()

export type Ipv6 = Branded.Branded<'Ipv6', string>
export const Ipv6 = Branded.Branded<Ipv6>()

export type Uuid = Branded.Branded<'Uuid', string>
export const Uuid = Branded.Branded<Uuid>()

export type Uri = Branded.Branded<'Uri', string>
export const Uri = Branded.Branded<Uri>()

export type UriReference = Branded.Branded<'UriReference', string>
export const UriReference = Branded.Branded<UriReference>()

export type Iri = Branded.Branded<'Iri', string>
export const Iri = Branded.Branded<Iri>()

export type IriReference = Branded.Branded<'IriReference', string>
export const IriReference = Branded.Branded<IriReference>()

export type JsonPointer = Branded.Branded<'JsonPointer', string>
export const JsonPointer = Branded.Branded<JsonPointer>()

export type RelativeJsonPointer = Branded.Branded<'RelativeJsonPointer', string>
export const RelativeJsonPointer = Branded.Branded<RelativeJsonPointer>()

export type RegexSource = Branded.Branded<'RegexSource', string>
export const RegexSource = Branded.Branded<RegexSource>()

export interface StringFormatToBrandedString {
  ['date-time']: DateTime
  ['date']: DateString
  ['time']: TimeString
  ['duration']: Duration
  ['email']: Email
  ['idn-email']: IdnEmail
  ['hostname']: Hostname
  ['idn-hostname']: IdnHostname
  ['ipv4']: Ipv4
  ['ipv6']: Ipv6
  ['uuid']: Uuid
  ['uri']: Uri
  ['uri-reference']: UriReference
  ['iri']: Iri
  ['iri-reference']: IriReference
  ['json-pointer']: JsonPointer
  ['relative-json-pointer']: RelativeJsonPointer
  ['regex']: RegexSource
}

export type GetTypeFromStringConstraints<
  Const extends string = never,
  Enum extends ReadonlyArray<string> = never,
  Format extends StringFormat = never,
> = {
  0: {
    0: BrandIfNotNever<Branded.BrandOf<StringFormatToBrandedString[Format]>, Const>
    1: {
      0: BrandIfNotNever<Branded.BrandOf<StringFormatToBrandedString[Format]>, Enum[number]>
      1: StringFormatToBrandedString[Format]
    }[Equals<never, Enum>]
  }[Equals<never, Const>]
  1: GetSharedType<Const, Enum, string>
}[Equals<never, Format>]

type BrandIfNotNever<Brand, T> = {
  0: Branded.Branded<Brand, T>
  1: T
}[Equals<never, Brand>]
