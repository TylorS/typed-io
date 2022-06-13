import { AnyAnnotation } from './Annotation/Annotation'

/**
 * Schema is an abstract type which keeps track of any number of capabilities, like deriving Decoders/Constructors,
 * which can be expanded dynamically as various interpreters are implemented expanding their capability.
 * Furthermore, a Schema can dynamically update or change the API it exposes atop of the current Schema, as
 * well as be annotated to contain additional information that can be used to generate rich sets of information from.
 */
export abstract class Schema<
  Capabilities extends AnyCapabilities,
  Api,
  Annotations extends AnyAnnotations,
> {
  static type: string
  abstract readonly type: string
  abstract get api(): Api

  readonly __NOT_AVAILABLE_AT_RUNTIME__!: {
    readonly _Capabilities: () => Capabilities
    readonly _Api: () => Api
    readonly _Annotations: () => Annotations
  }
}

/**
 * Helper for constructing functions/classes which depend on any Schema type.
 */
export type AnySchema = Schema<any, any, any>

/**
 * Helper for constructing functions/classes which depend on any Schema type with a minimum set of capabilities.
 */
export type AnySchemaWith<Capabilities extends AnyCapabilities> = Schema<Capabilities, any, any>

/**
 * Helper for constructing functions/classes which depend on any Schema Constructor type with a minimum set of capabilities.
 */
export type AnySchemaConstructorWith<Capabilities extends AnyCapabilities> = {
  new (...args: any): AnySchemaWith<Capabilities>
  readonly type: string
}

/**
 * Helper for constructing functions/classes which depend on any Schema constructor type.
 */
export type AnySchemaConstructor = AnySchemaConstructorWith<any>

/**
 * Helper for constructing functions/classes which depend on any capability type a Schema might have.
 */
export type AnyCapabilities = Readonly<Record<PropertyKey, any>>

/**
 * Helper for constructing functions/classes which depend on any Annotation type a Schema might have.
 */
export type AnyAnnotations = ReadonlyArray<AnyAnnotation>

/**
 * Type-level helper for updating the Capabilities of a Schema
 */
export type UpdateCapabilities<C extends AnyCapabilities, D extends AnyCapabilities> = [
  {
    readonly [K in keyof C | keyof D]: K extends keyof D ? D[K] : C[K]
  },
] extends [infer R]
  ? { readonly [K in keyof R]: R[K] }
  : never

export const ContinuationSymbol = Symbol('@typed/io/Continuation')
export type ContinuationSymbol = typeof ContinuationSymbol

/**
 * HasContinuation is a capability that most Schema implementations should have, which allows
 * for a uniform place to exist where Interpreters can traverse up the Tree of Schemas to derive
 * all the capabilities a Schema might have.
 */
export interface HasContinuation {
  readonly [ContinuationSymbol]: AnySchema
}

/**
 * Checks to see if a Schema has a Continuation
 */
export function hasContinuation<C extends AnyCapabilities, Api, Annotations extends AnyAnnotations>(
  schema: Schema<C, Api, Annotations>,
): schema is Schema<C, Api, Annotations> & HasContinuation {
  return ContinuationSymbol in schema
}

/**
 * Construct a Property, which defaults to being required.
 */
export const prop = <A>(value: A) => new Property(value, false)

/**
 * A Property is a first class concept with @typed/io which allows tracking the optionality of properties
 * within structures like JSON objects to be utilized by interpreters of Schemas.
 */
export class Property<A, IsOptional extends boolean> {
  constructor(readonly value: A, readonly isOptional: IsOptional) {}

  /**
   * Make a Property Optional
   */
  readonly optional = () => new Property(this.value, true)

  /**
   * Make a Property Required
   */
  readonly required = () => new Property(this.value, false)
}
