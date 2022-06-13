import parseISO from 'date-fns/parseISO'
import * as S from 'hkt-ts/string'

import {
  DateString,
  DateTime,
  Duration,
  Email,
  GetTypeFromStringConstraints,
  Hostname,
  IdnEmail,
  IdnHostname,
  Ipv4,
  Ipv6,
  JsonPointer,
  RegexSource,
  RelativeJsonPointer,
  StringConstraints,
  StringFormat,
  TimeString,
  Uri,
  UriReference,
  Uuid,
} from '@/JsonSchema/JsonSchema'

export const EMAIL_REGEX =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

export const HOSTNAME_REGEX =
  /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/i

export const IDN_EMAIL_REGEX =
  /^(?!\.)((?!.*\.{2})[a-zA-Z0-9\u00E0-\u00FC.!#$%&'*+-/=?^_`{|}~\-\d]+)@(?!\.)([a-zA-Z0-9\u00E0-\u00FC\-.\d]+)((\.([a-zA-Z]){2,63})+)$/iu

export const IDN_HOSTNAME_REGEX = /((xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}/iu

export const ISO8601_DURATION_REGEX =
  /^[-+]?P(?!$)(([-+]?\d+Y)|([-+]?\d+\.\d+Y$))?(([-+]?\d+M)|([-+]?\d+\.\d+M$))?(([-+]?\d+W)|([-+]?\d+\.\d+W$))?(([-+]?\d+D)|([-+]?\d+\.\d+D$))?(T(?=[\d+-])(([-+]?\d+H)|([-+]?\d+\.\d+H$))?(([-+]?\d+M)|([-+]?\d+\.\d+M$))?([-+]?\d+(\.\d+)?S)?)??$/

export const ISO8601_TIME_REGEX =
  /(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:Z|-0[1-9]|-1\d|-2[0-3]|-00:?(?:0[1-9]|[1-5]\d)|\+[01]\d|\+2[0-3])(?:|:?[0-5]\d)/

export const IPV4_REGEX =
  /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/i

export const IPV6_REGEX =
  /^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$/

export const JSON_POINTER_REGEX = /(\/(([^/~])|(~[01]))*)/

export const RELATIVE_JSON_POINTER_REGEX = /^[0-9]+#\/(([^/~])|(~[01]))*$/

export const URI_REGEX =
  /([A-Za-z][A-Za-z0-9+\-.]*):(?:(\/\/)(?:((?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*)@)?((?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*))(?::([0-9]*))?((?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|\/((?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?)|((?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|)(?:\?((?:[A-Za-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?(?:#((?:[A-Za-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?/

export const URI_REFERENCE_REGEX = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/

export const UUID_REGEX =
  /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/

export const isString =
  <
    Const extends string = never,
    Enum extends ReadonlyArray<string> = never,
    Format extends StringFormat = never,
  >(
    constraints?: StringConstraints<Const, Enum, Format>,
  ) =>
  (x: unknown): x is GetTypeFromStringConstraints<Const, Enum, Format> => {
    if (!S.isString(x)) {
      return false
    }

    if (!constraints) {
      return true
    }

    if ('const' in constraints) {
      return constraints.const === x
    }

    if (constraints.enum) {
      return constraints.enum.includes(x)
    }

    const { minLength = 0, maxLength = Infinity } = constraints

    if (minLength > x.length || maxLength < x.length) {
      return false
    }

    if (constraints.pattern && !constraints.pattern.test(x)) {
      return false
    }

    if (constraints.format) {
      switch (constraints.format) {
        case 'date':
          return isDateString(x)
        case 'date-time':
          return isDateTime(x)
        case 'duration':
          return isDuration(x)
        case 'email':
          return isEmail(x)
        case 'hostname':
          return isHostname(x)
        case 'idn-email':
          return isIdnEmail(x)
        case 'idn-hostname':
          return isIdnHostname(x)
        case 'ipv4':
          return isIpv4(x)
        case 'ipv6':
          return isIpv6(x)
        case 'json-pointer':
          return isJsonPointer(x)
        case 'relative-json-pointer':
          return isRelativeJsonPointer(x)
        case 'time':
          return isTimeString(x)
        case 'iri-reference':
        case 'uri-reference':
          return isUriReference(x)
        case 'iri':
        case 'uri':
          return isUri(x)
        case 'uuid':
          return isUuid(x)
        case 'regex':
          return isRegexSource(x)
        default: {
          console.info(
            `Unsupported JsonSchema Format ${constraints.format} for @typed/io refinements, returning true optimistically.`,
            `\n`,
            `Please feel free to open a pull request if support for this format is important to you, it will be happily accepted.`,
          )
        }
      }
    }

    return true
  }

export const isDateString = (x: string): x is DateString => {
  const date = parseISO(x)

  return !Number.isNaN(date)
}

// Checks to see if a Date has not hours/minutes/seconds/milliseconds
const isDateString_ = (date: Date) =>
  date.getHours() === 0 &&
  date.getMinutes() === 0 &&
  date.getSeconds() === 0 &&
  date.getMilliseconds() === 0

export const isDateTime = (x: string): x is DateTime => {
  const date = parseISO(x)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  return !isDateString_(date)
}

export const isDuration = (x: string): x is Duration => ISO8601_DURATION_REGEX.test(x)

export const isTimeString = (x: string): x is TimeString => ISO8601_TIME_REGEX.test(x)

export const isEmail = (x: string): x is Email => EMAIL_REGEX.test(x)

export const isHostname = (x: string): x is Hostname => HOSTNAME_REGEX.test(x)

export const isIdnEmail = (x: string): x is IdnEmail => IDN_EMAIL_REGEX.test(x)

export const isIdnHostname = (x: string): x is IdnHostname => IDN_HOSTNAME_REGEX.test(x)

export const isIpv4 = (x: string): x is Ipv4 => IPV4_REGEX.test(x)

export const isIpv6 = (x: string): x is Ipv6 => IPV6_REGEX.test(x)

export const isJsonPointer = (x: string): x is JsonPointer => JSON_POINTER_REGEX.test(x)

export const isRelativeJsonPointer = (x: string): x is RelativeJsonPointer =>
  RELATIVE_JSON_POINTER_REGEX.test(x)

export const isUri = (x: string): x is Uri => URI_REGEX.test(x)

export const isUriReference = (x: string): x is UriReference => URI_REFERENCE_REGEX.test(x)

export const isUuid = (x: string): x is Uuid => UUID_REGEX.test(x)

export const isRegexSource = (x: string): x is RegexSource => {
  try {
    return new RegExp(x), true
  } catch {
    return false
  }
}
