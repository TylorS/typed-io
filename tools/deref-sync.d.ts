declare module 'json-schema-deref-sync' {
  import { JSONSchema7 } from 'json-schema'

  const deref: <S extends JSONSchema7, B extends JSONSchema7>(
    schema: S,
    options?: { baseFolder?: string },
  ) => B

  export default deref
}
