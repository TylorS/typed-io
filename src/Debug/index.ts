export * from './DebugSchema'

const foo = struct({ ....})

const fooDebug = toDebug(foo)
const fooDecoder = toDecoder(foo)
const fooDecoder = toDecoder(foo)

fooDebug.debug({...})
