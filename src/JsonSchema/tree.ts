import { RoseTree } from 'hkt-ts/RoseTree'
import { Tree } from 'hkt-ts/Tree'

import { $ref, JsonSchema, JsonSchemaHKT } from './JsonSchema'
import { array } from './array'
import { string } from './string'
import { struct } from './struct'
import { sum } from './sum'

import { SharedConstraints } from '@/Constraints/shared'
import { prop } from '@/Schema'

/**
 * Construct a JsonSchema which represents a Tree structure. An ID must be provided to handle
 * the circular structure of a Tree Schema.
 */
export const tree = <P, C>(
  id: string,
  parent: JsonSchema<P>,
  child: JsonSchema<C>,
  constraints?: Omit<SharedConstraints<JsonSchemaHKT, Tree<P, C>>, '$id'>,
): JsonSchema<Tree<P, C>> =>
  sum<Tree<P, C>>({ ...constraints, $id: id })('tag')({
    Parent: struct({
      tag: prop(string({ const: 'Parent' })),
      value: prop(parent),
      forest: prop(array($ref<Tree<P, C>>()(id))),
    }),
    Leaf: struct({
      tag: prop(string({ const: 'Leaf' })),
      value: prop(child),
    }),
  })

export const roseTree = <A>(
  id: string,
  value: JsonSchema<A>,
  constraints?: Omit<SharedConstraints<JsonSchemaHKT, RoseTree<A>>, '$id'>,
): JsonSchema<RoseTree<A>> => tree(id, value, value, constraints)
