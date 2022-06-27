import { DecoderInterpreter } from './Interpreter'
import * as interpereters from './interpreters'

export const defaultDecoderInterpreter = new DecoderInterpreter(...Object.values(interpereters))

export const { toDecoder } = defaultDecoderInterpreter
