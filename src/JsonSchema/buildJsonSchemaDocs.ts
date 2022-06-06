import * as M from 'hkt-ts/Maybe'
import { pipe } from 'hkt-ts/function'
import { JSONSchema7, JSONSchema7Type } from 'json-schema'

export function buildDocumentation(s: JSONSchema7): Documentation {
  return {
    comment: M.fromNullable(s.$comment),
    description: M.fromNullable(s.description),
    default: pipe(s.default, M.fromNullable, M.map(parseDefault)),
    examples: pipe(
      s.examples,
      M.fromRefinement((t): t is Exclude<typeof t, undefined> => t !== undefined),
      M.map(parseExamples),
      M.getOrElse(() => []),
    ),
  }
}

export interface Documentation {
  readonly comment: M.Maybe<string>
  readonly description: M.Maybe<string>
  readonly default: M.Maybe<string>
  readonly examples: ReadonlyArray<string>
}

export function parseDefault(value: JSONSchema7Type) {
  if (value === null) {
    return 'null'
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value)
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return `${value}`
}

export function parseExamples(
  examples: Exclude<JSONSchema7['examples'], undefined>,
): ReadonlyArray<string> {
  if (examples === null) {
    return []
  }

  if (Array.isArray(examples)) {
    return examples.flatMap(parseExamples)
  }

  if (typeof examples === 'object') {
    return Object.values(examples).flatMap(parseExamples)
  }

  return [`${examples}`]
}
