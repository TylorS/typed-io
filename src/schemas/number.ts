import { float } from './float'
import { integer } from './integer'
import { union } from './union'

export const number = (
  constraints?: import('fast-check').IntegerConstraints & import('fast-check').FloatConstraints,
) => union(float(constraints), integer(constraints))
