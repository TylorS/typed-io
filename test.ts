import { GetTypeFromStringConstraints } from './src/Constraints/string'
import { OutputOf } from './src/Decoder/Decoder'
import { ErrorsFromJsonSchema, fromJsonSchema } from './src/Decoder/fromJsonSchema'
import { ExtractAllOf, FromJsonSchema, FromJsonSchemaMap, FromJsonSchemaObject, GetKeys } from './src/JsonSchema/type-level'

const jsonSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'glTF.schema.json',
  title: 'glTF',
  type: 'object',
  description: 'The root object for a glTF asset.',
  allOf: [
    {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      $id: 'glTFProperty.schema.json',
      title: 'glTF Property',
      type: 'object',
      properties: {
        extensions: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          $id: 'extension.schema.json',
          title: 'Extension',
          type: 'object',
          description: 'JSON object with extension-specific objects.',
          properties: {},
          additionalProperties: {
            type: 'object',
          },
        },
        extras: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          $id: 'extras.schema.json',
          title: 'Extras',
          description: 'Application-specific data.',
          gltf_sectionDescription:
            'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
        },
      },
    },
  ],
  properties: {
    extensionsUsed: {
      type: 'array',
      description: 'Names of glTF extensions used in this asset.',
      items: {
        type: 'string',
      },
      uniqueItems: true,
      minItems: 1,
    },
    extensionsRequired: {
      type: 'array',
      description: 'Names of glTF extensions required to properly load this asset.',
      items: {
        type: 'string',
      },
      uniqueItems: true,
      minItems: 1,
    },
    accessors: {
      type: 'array',
      description: 'An array of accessors.',
      items: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'accessor.schema.json',
        title: 'Accessor',
        type: 'object',
        description: 'A typed view into a buffer view that contains raw binary data.',
        allOf: [
          {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'glTFChildOfRootProperty.schema.json',
            title: 'glTF Child of Root Property',
            type: 'object',
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFProperty.schema.json',
                title: 'glTF Property',
                type: 'object',
                properties: {
                  extensions: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extension.schema.json',
                    title: 'Extension',
                    type: 'object',
                    description: 'JSON object with extension-specific objects.',
                    properties: {},
                    additionalProperties: {
                      type: 'object',
                    },
                  },
                  extras: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extras.schema.json',
                    title: 'Extras',
                    description: 'Application-specific data.',
                    gltf_sectionDescription:
                      'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The user-defined name of this object.',
                gltf_detailedDescription:
                  'The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.',
              },
            },
          },
        ],
        properties: {
          bufferView: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFid.schema.json',
                title: 'glTF Id',
                type: 'integer',
                minimum: 0,
              },
            ],
            description: 'The index of the bufferView.',
            gltf_detailedDescription:
              'The index of the buffer view. When undefined, the accessor **MUST** be initialized with zeros; `sparse` property or extensions **MAY** override zeros with actual values.',
          },
          byteOffset: {
            type: 'integer',
            description: 'The offset relative to the start of the buffer view in bytes.',
            minimum: 0,
            default: 0,
            gltf_detailedDescription:
              'The offset relative to the start of the buffer view in bytes.  This **MUST** be a multiple of the size of the component datatype. This property **MUST NOT** be defined when `bufferView` is undefined.',
            gltf_webgl: '`vertexAttribPointer()` offset parameter',
          },
          componentType: {
            description: "The datatype of the accessor's components.",
            gltf_detailedDescription:
              "The datatype of the accessor's components.  UNSIGNED_INT type **MUST NOT** be used for any accessor that is not referenced by `mesh.primitive.indices`.",
            gltf_webgl:
              '`type` parameter of `vertexAttribPointer()`.  The corresponding typed arrays are `Int8Array`, `Uint8Array`, `Int16Array`, `Uint16Array`, `Uint32Array`, and `Float32Array`.',
            anyOf: [
              {
                const: 5120,
                description: 'BYTE',
                type: 'integer',
              },
              {
                const: 5121,
                description: 'UNSIGNED_BYTE',
                type: 'integer',
              },
              {
                const: 5122,
                description: 'SHORT',
                type: 'integer',
              },
              {
                const: 5123,
                description: 'UNSIGNED_SHORT',
                type: 'integer',
              },
              {
                const: 5125,
                description: 'UNSIGNED_INT',
                type: 'integer',
              },
              {
                const: 5126,
                description: 'FLOAT',
                type: 'integer',
              },
              {
                type: 'integer',
              },
            ],
          },
          normalized: {
            type: 'boolean',
            description: 'Specifies whether integer data values are normalized before usage.',
            default: false,
            gltf_detailedDescription:
              'Specifies whether integer data values are normalized (`true`) to [0, 1] (for unsigned types) or to [-1, 1] (for signed types) when they are accessed. This property **MUST NOT** be set to `true` for accessors with `FLOAT` or `UNSIGNED_INT` component type.',
            gltf_webgl: '`normalized` parameter of `vertexAttribPointer()` ',
          },
          count: {
            type: 'integer',
            description: 'The number of elements referenced by this accessor.',
            minimum: 1,
            gltf_detailedDescription:
              'The number of elements referenced by this accessor, not to be confused with the number of bytes or number of components.',
          },
          type: {
            description: "Specifies if the accessor's elements are scalars, vectors, or matrices.",
            anyOf: [
              {
                const: 'SCALAR',
              },
              {
                const: 'VEC2',
              },
              {
                const: 'VEC3',
              },
              {
                const: 'VEC4',
              },
              {
                const: 'MAT2',
              },
              {
                const: 'MAT3',
              },
              {
                const: 'MAT4',
              },
              {
                type: 'string',
              },
            ],
          },
          max: {
            type: 'array',
            description: 'Maximum value of each component in this accessor.',
            items: {
              type: 'number',
            },
            minItems: 1,
            maxItems: 16,
            gltf_detailedDescription:
              "Maximum value of each component in this accessor.  Array elements **MUST** be treated as having the same data type as accessor's `componentType`. Both `min` and `max` arrays have the same length.  The length is determined by the value of the `type` property; it can be 1, 2, 3, 4, 9, or 16.\n\n`normalized` property has no effect on array values: they always correspond to the actual values stored in the buffer. When the accessor is sparse, this property **MUST** contain maximum values of accessor data with sparse substitution applied.",
          },
          min: {
            type: 'array',
            description: 'Minimum value of each component in this accessor.',
            items: {
              type: 'number',
            },
            minItems: 1,
            maxItems: 16,
            gltf_detailedDescription:
              "Minimum value of each component in this accessor.  Array elements **MUST** be treated as having the same data type as accessor's `componentType`. Both `min` and `max` arrays have the same length.  The length is determined by the value of the `type` property; it can be 1, 2, 3, 4, 9, or 16.\n\n`normalized` property has no effect on array values: they always correspond to the actual values stored in the buffer. When the accessor is sparse, this property **MUST** contain minimum values of accessor data with sparse substitution applied.",
          },
          sparse: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'accessor.sparse.schema.json',
                title: 'Accessor Sparse',
                type: 'object',
                description:
                  'Sparse storage of accessor values that deviate from their initialization value.',
                allOf: [
                  {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'glTFProperty.schema.json',
                    title: 'glTF Property',
                    type: 'object',
                    properties: {
                      extensions: {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'extension.schema.json',
                        title: 'Extension',
                        type: 'object',
                        description: 'JSON object with extension-specific objects.',
                        properties: {},
                        additionalProperties: {
                          type: 'object',
                        },
                      },
                      extras: {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'extras.schema.json',
                        title: 'Extras',
                        description: 'Application-specific data.',
                        gltf_sectionDescription:
                          'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                      },
                    },
                  },
                ],
                properties: {
                  count: {
                    type: 'integer',
                    description: 'Number of deviating accessor values stored in the sparse array.',
                    minimum: 1,
                  },
                  indices: {
                    allOf: [
                      {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'accessor.sparse.indices.schema.json',
                        title: 'Accessor Sparse Indices',
                        type: 'object',
                        description:
                          'An object pointing to a buffer view containing the indices of deviating accessor values. The number of indices is equal to `accessor.sparse.count`. Indices **MUST** strictly increase.',
                        allOf: [
                          {
                            $schema: 'https://json-schema.org/draft/2020-12/schema',
                            $id: 'glTFProperty.schema.json',
                            title: 'glTF Property',
                            type: 'object',
                            properties: {
                              extensions: {
                                $schema: 'https://json-schema.org/draft/2020-12/schema',
                                $id: 'extension.schema.json',
                                title: 'Extension',
                                type: 'object',
                                description: 'JSON object with extension-specific objects.',
                                properties: {},
                                additionalProperties: {
                                  type: 'object',
                                },
                              },
                              extras: {
                                $schema: 'https://json-schema.org/draft/2020-12/schema',
                                $id: 'extras.schema.json',
                                title: 'Extras',
                                description: 'Application-specific data.',
                                gltf_sectionDescription:
                                  'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                              },
                            },
                          },
                        ],
                        properties: {
                          bufferView: {
                            allOf: [
                              {
                                $schema: 'https://json-schema.org/draft/2020-12/schema',
                                $id: 'glTFid.schema.json',
                                title: 'glTF Id',
                                type: 'integer',
                                minimum: 0,
                              },
                            ],
                            description:
                              'The index of the buffer view with sparse indices. The referenced buffer view **MUST NOT** have its `target` or `byteStride` properties defined. The buffer view and the optional `byteOffset` **MUST** be aligned to the `componentType` byte length.',
                          },
                          byteOffset: {
                            type: 'integer',
                            description:
                              'The offset relative to the start of the buffer view in bytes.',
                            minimum: 0,
                            default: 0,
                          },
                          componentType: {
                            description: 'The indices data type.',
                            anyOf: [
                              {
                                const: 5121,
                                description: 'UNSIGNED_BYTE',
                                type: 'integer',
                              },
                              {
                                const: 5123,
                                description: 'UNSIGNED_SHORT',
                                type: 'integer',
                              },
                              {
                                const: 5125,
                                description: 'UNSIGNED_INT',
                                type: 'integer',
                              },
                              {
                                type: 'integer',
                              },
                            ],
                          },
                          extensions: {},
                          extras: {},
                        },
                        required: ['bufferView', 'componentType'],
                      },
                    ],
                    description:
                      'An object pointing to a buffer view containing the indices of deviating accessor values. The number of indices is equal to `count`. Indices **MUST** strictly increase.',
                  },
                  values: {
                    allOf: [
                      {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'accessor.sparse.values.schema.json',
                        title: 'Accessor Sparse Values',
                        type: 'object',
                        description:
                          'An object pointing to a buffer view containing the deviating accessor values. The number of elements is equal to `accessor.sparse.count` times number of components. The elements have the same component type as the base accessor. The elements are tightly packed. Data **MUST** be aligned following the same rules as the base accessor.',
                        allOf: [
                          {
                            $schema: 'https://json-schema.org/draft/2020-12/schema',
                            $id: 'glTFProperty.schema.json',
                            title: 'glTF Property',
                            type: 'object',
                            properties: {
                              extensions: {
                                $schema: 'https://json-schema.org/draft/2020-12/schema',
                                $id: 'extension.schema.json',
                                title: 'Extension',
                                type: 'object',
                                description: 'JSON object with extension-specific objects.',
                                properties: {},
                                additionalProperties: {
                                  type: 'object',
                                },
                              },
                              extras: {
                                $schema: 'https://json-schema.org/draft/2020-12/schema',
                                $id: 'extras.schema.json',
                                title: 'Extras',
                                description: 'Application-specific data.',
                                gltf_sectionDescription:
                                  'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                              },
                            },
                          },
                        ],
                        properties: {
                          bufferView: {
                            allOf: [
                              {
                                $schema: 'https://json-schema.org/draft/2020-12/schema',
                                $id: 'glTFid.schema.json',
                                title: 'glTF Id',
                                type: 'integer',
                                minimum: 0,
                              },
                            ],
                            description:
                              'The index of the bufferView with sparse values. The referenced buffer view **MUST NOT** have its `target` or `byteStride` properties defined.',
                          },
                          byteOffset: {
                            type: 'integer',
                            description:
                              'The offset relative to the start of the bufferView in bytes.',
                            minimum: 0,
                            default: 0,
                          },
                          extensions: {},
                          extras: {},
                        },
                        required: ['bufferView'],
                      },
                    ],
                    description:
                      'An object pointing to a buffer view containing the deviating accessor values.',
                  },
                  extensions: {},
                  extras: {},
                },
                required: ['count', 'indices', 'values'],
              },
            ],
            description: 'Sparse storage of elements that deviate from their initialization value.',
          },
          name: {},
          extensions: {},
          extras: {},
        },
        dependencies: {
          byteOffset: ['bufferView'],
        },
        required: ['componentType', 'count', 'type'],
      },
      minItems: 1,
      gltf_detailedDescription:
        'An array of accessors.  An accessor is a typed view into a bufferView.',
    },
    animations: {
      type: 'array',
      description: 'An array of keyframe animations.',
      items: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'animation.schema.json',
        title: 'Animation',
        type: 'object',
        description: 'A keyframe animation.',
        allOf: [
          {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'glTFChildOfRootProperty.schema.json',
            title: 'glTF Child of Root Property',
            type: 'object',
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFProperty.schema.json',
                title: 'glTF Property',
                type: 'object',
                properties: {
                  extensions: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extension.schema.json',
                    title: 'Extension',
                    type: 'object',
                    description: 'JSON object with extension-specific objects.',
                    properties: {},
                    additionalProperties: {
                      type: 'object',
                    },
                  },
                  extras: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extras.schema.json',
                    title: 'Extras',
                    description: 'Application-specific data.',
                    gltf_sectionDescription:
                      'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The user-defined name of this object.',
                gltf_detailedDescription:
                  'The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.',
              },
            },
          },
        ],
        properties: {
          channels: {
            type: 'array',
            description:
              'An array of animation channels. An animation channel combines an animation sampler with a target property being animated. Different channels of the same animation **MUST NOT** have the same targets.',
            items: {
              $schema: 'https://json-schema.org/draft/2020-12/schema',
              $id: 'animation.channel.schema.json',
              title: 'Animation Channel',
              type: 'object',
              description:
                'An animation channel combines an animation sampler with a target property being animated.',
              allOf: [
                {
                  $schema: 'https://json-schema.org/draft/2020-12/schema',
                  $id: 'glTFProperty.schema.json',
                  title: 'glTF Property',
                  type: 'object',
                  properties: {
                    extensions: {
                      $schema: 'https://json-schema.org/draft/2020-12/schema',
                      $id: 'extension.schema.json',
                      title: 'Extension',
                      type: 'object',
                      description: 'JSON object with extension-specific objects.',
                      properties: {},
                      additionalProperties: {
                        type: 'object',
                      },
                    },
                    extras: {
                      $schema: 'https://json-schema.org/draft/2020-12/schema',
                      $id: 'extras.schema.json',
                      title: 'Extras',
                      description: 'Application-specific data.',
                      gltf_sectionDescription:
                        'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                    },
                  },
                },
              ],
              properties: {
                sampler: {
                  allOf: [
                    {
                      $schema: 'https://json-schema.org/draft/2020-12/schema',
                      $id: 'glTFid.schema.json',
                      title: 'glTF Id',
                      type: 'integer',
                      minimum: 0,
                    },
                  ],
                  description:
                    'The index of a sampler in this animation used to compute the value for the target.',
                  gltf_detailedDescription:
                    "The index of a sampler in this animation used to compute the value for the target, e.g., a node's translation, rotation, or scale (TRS).",
                },
                target: {
                  allOf: [
                    {
                      $schema: 'https://json-schema.org/draft/2020-12/schema',
                      $id: 'animation.channel.target.schema.json',
                      title: 'Animation Channel Target',
                      type: 'object',
                      description: 'The descriptor of the animated property.',
                      allOf: [
                        {
                          $schema: 'https://json-schema.org/draft/2020-12/schema',
                          $id: 'glTFProperty.schema.json',
                          title: 'glTF Property',
                          type: 'object',
                          properties: {
                            extensions: {
                              $schema: 'https://json-schema.org/draft/2020-12/schema',
                              $id: 'extension.schema.json',
                              title: 'Extension',
                              type: 'object',
                              description: 'JSON object with extension-specific objects.',
                              properties: {},
                              additionalProperties: {
                                type: 'object',
                              },
                            },
                            extras: {
                              $schema: 'https://json-schema.org/draft/2020-12/schema',
                              $id: 'extras.schema.json',
                              title: 'Extras',
                              description: 'Application-specific data.',
                              gltf_sectionDescription:
                                'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                            },
                          },
                        },
                      ],
                      properties: {
                        node: {
                          allOf: [
                            {
                              $schema: 'https://json-schema.org/draft/2020-12/schema',
                              $id: 'glTFid.schema.json',
                              title: 'glTF Id',
                              type: 'integer',
                              minimum: 0,
                            },
                          ],
                          description:
                            'The index of the node to animate. When undefined, the animated object **MAY** be defined by an extension.',
                        },
                        path: {
                          description:
                            'The name of the node\'s TRS property to animate, or the `"weights"` of the Morph Targets it instantiates. For the `"translation"` property, the values that are provided by the sampler are the translation along the X, Y, and Z axes. For the `"rotation"` property, the values are a quaternion in the order (x, y, z, w), where w is the scalar. For the `"scale"` property, the values are the scaling factors along the X, Y, and Z axes.',
                          anyOf: [
                            {
                              const: 'translation',
                            },
                            {
                              const: 'rotation',
                            },
                            {
                              const: 'scale',
                            },
                            {
                              const: 'weights',
                            },
                            {
                              type: 'string',
                            },
                          ],
                        },
                        extensions: {},
                        extras: {},
                      },
                      required: ['path'],
                    },
                  ],
                  description: 'The descriptor of the animated property.',
                },
                extensions: {},
                extras: {},
              },
              required: ['sampler', 'target'],
            },
            minItems: 1,
          },
          samplers: {
            type: 'array',
            description:
              'An array of animation samplers. An animation sampler combines timestamps with a sequence of output values and defines an interpolation algorithm.',
            items: {
              $schema: 'https://json-schema.org/draft/2020-12/schema',
              $id: 'animation.sampler.schema.json',
              title: 'Animation Sampler',
              type: 'object',
              description:
                'An animation sampler combines timestamps with a sequence of output values and defines an interpolation algorithm.',
              allOf: [
                {
                  $schema: 'https://json-schema.org/draft/2020-12/schema',
                  $id: 'glTFProperty.schema.json',
                  title: 'glTF Property',
                  type: 'object',
                  properties: {
                    extensions: {
                      $schema: 'https://json-schema.org/draft/2020-12/schema',
                      $id: 'extension.schema.json',
                      title: 'Extension',
                      type: 'object',
                      description: 'JSON object with extension-specific objects.',
                      properties: {},
                      additionalProperties: {
                        type: 'object',
                      },
                    },
                    extras: {
                      $schema: 'https://json-schema.org/draft/2020-12/schema',
                      $id: 'extras.schema.json',
                      title: 'Extras',
                      description: 'Application-specific data.',
                      gltf_sectionDescription:
                        'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                    },
                  },
                },
              ],
              properties: {
                input: {
                  allOf: [
                    {
                      $schema: 'https://json-schema.org/draft/2020-12/schema',
                      $id: 'glTFid.schema.json',
                      title: 'glTF Id',
                      type: 'integer',
                      minimum: 0,
                    },
                  ],
                  description: 'The index of an accessor containing keyframe timestamps.',
                  gltf_detailedDescription:
                    'The index of an accessor containing keyframe timestamps. The accessor **MUST** be of scalar type with floating-point components. The values represent time in seconds with `time[0] >= 0.0`, and strictly increasing values, i.e., `time[n + 1] > time[n]`.',
                },
                interpolation: {
                  description: 'Interpolation algorithm.',
                  default: 'LINEAR',
                  gltf_detailedDescription: 'Interpolation algorithm.',
                  anyOf: [
                    {
                      const: 'LINEAR',
                      description:
                        'The animated values are linearly interpolated between keyframes. When targeting a rotation, spherical linear interpolation (slerp) **SHOULD** be used to interpolate quaternions. The number of output elements **MUST** equal the number of input elements.',
                    },
                    {
                      const: 'STEP',
                      description:
                        'The animated values remain constant to the output of the first keyframe, until the next keyframe. The number of output elements **MUST** equal the number of input elements.',
                    },
                    {
                      const: 'CUBICSPLINE',
                      description:
                        "The animation's interpolation is computed using a cubic spline with specified tangents. The number of output elements **MUST** equal three times the number of input elements. For each input element, the output stores three elements, an in-tangent, a spline vertex, and an out-tangent. There **MUST** be at least two keyframes when using this interpolation.",
                    },
                    {
                      type: 'string',
                    },
                  ],
                },
                output: {
                  allOf: [
                    {
                      $schema: 'https://json-schema.org/draft/2020-12/schema',
                      $id: 'glTFid.schema.json',
                      title: 'glTF Id',
                      type: 'integer',
                      minimum: 0,
                    },
                  ],
                  description: 'The index of an accessor, containing keyframe output values.',
                },
                extensions: {},
                extras: {},
              },
              required: ['input', 'output'],
            },
            minItems: 1,
          },
          name: {},
          extensions: {},
          extras: {},
        },
        required: ['channels', 'samplers'],
      },
      minItems: 1,
    },
    asset: {
      allOf: [
        {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          $id: 'asset.schema.json',
          title: 'Asset',
          type: 'object',
          description: 'Metadata about the glTF asset.',
          allOf: [
            {
              $schema: 'https://json-schema.org/draft/2020-12/schema',
              $id: 'glTFProperty.schema.json',
              title: 'glTF Property',
              type: 'object',
              properties: {
                extensions: {
                  $schema: 'https://json-schema.org/draft/2020-12/schema',
                  $id: 'extension.schema.json',
                  title: 'Extension',
                  type: 'object',
                  description: 'JSON object with extension-specific objects.',
                  properties: {},
                  additionalProperties: {
                    type: 'object',
                  },
                },
                extras: {
                  $schema: 'https://json-schema.org/draft/2020-12/schema',
                  $id: 'extras.schema.json',
                  title: 'Extras',
                  description: 'Application-specific data.',
                  gltf_sectionDescription:
                    'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                },
              },
            },
          ],
          properties: {
            copyright: {
              type: 'string',
              description:
                'A copyright message suitable for display to credit the content creator.',
            },
            generator: {
              type: 'string',
              description: 'Tool that generated this glTF model.  Useful for debugging.',
            },
            version: {
              type: 'string',
              description:
                'The glTF version in the form of `<major>.<minor>` that this asset targets.',
              pattern: '^[0-9]+\\.[0-9]+$',
            },
            minVersion: {
              type: 'string',
              description:
                'The minimum glTF version in the form of `<major>.<minor>` that this asset targets. This property **MUST NOT** be greater than the asset version.',
              pattern: '^[0-9]+\\.[0-9]+$',
            },
            extensions: {},
            extras: {},
          },
          required: ['version'],
        },
      ],
      description: 'Metadata about the glTF asset.',
    },
    buffers: {
      type: 'array',
      description: 'An array of buffers.',
      items: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'buffer.schema.json',
        title: 'Buffer',
        type: 'object',
        description: 'A buffer points to binary geometry, animation, or skins.',
        allOf: [
          {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'glTFChildOfRootProperty.schema.json',
            title: 'glTF Child of Root Property',
            type: 'object',
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFProperty.schema.json',
                title: 'glTF Property',
                type: 'object',
                properties: {
                  extensions: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extension.schema.json',
                    title: 'Extension',
                    type: 'object',
                    description: 'JSON object with extension-specific objects.',
                    properties: {},
                    additionalProperties: {
                      type: 'object',
                    },
                  },
                  extras: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extras.schema.json',
                    title: 'Extras',
                    description: 'Application-specific data.',
                    gltf_sectionDescription:
                      'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The user-defined name of this object.',
                gltf_detailedDescription:
                  'The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.',
              },
            },
          },
        ],
        properties: {
          uri: {
            type: 'string',
            description: 'The URI (or IRI) of the buffer.',
            format: 'iri-reference',
            gltf_detailedDescription:
              'The URI (or IRI) of the buffer.  Relative paths are relative to the current glTF asset.  Instead of referencing an external file, this field **MAY** contain a `data:`-URI.',
            gltf_uriType: 'application',
          },
          byteLength: {
            type: 'integer',
            description: 'The length of the buffer in bytes.',
            minimum: 1,
          },
          name: {},
          extensions: {},
          extras: {},
        },
        required: ['byteLength'],
      },
      minItems: 1,
      gltf_detailedDescription:
        'An array of buffers.  A buffer points to binary geometry, animation, or skins.',
    },
    bufferViews: {
      type: 'array',
      description: 'An array of bufferViews.',
      items: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'bufferView.schema.json',
        title: 'Buffer View',
        type: 'object',
        description: 'A view into a buffer generally representing a subset of the buffer.',
        allOf: [
          {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'glTFChildOfRootProperty.schema.json',
            title: 'glTF Child of Root Property',
            type: 'object',
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFProperty.schema.json',
                title: 'glTF Property',
                type: 'object',
                properties: {
                  extensions: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extension.schema.json',
                    title: 'Extension',
                    type: 'object',
                    description: 'JSON object with extension-specific objects.',
                    properties: {},
                    additionalProperties: {
                      type: 'object',
                    },
                  },
                  extras: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extras.schema.json',
                    title: 'Extras',
                    description: 'Application-specific data.',
                    gltf_sectionDescription:
                      'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The user-defined name of this object.',
                gltf_detailedDescription:
                  'The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.',
              },
            },
          },
        ],
        properties: {
          buffer: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFid.schema.json',
                title: 'glTF Id',
                type: 'integer',
                minimum: 0,
              },
            ],
            description: 'The index of the buffer.',
          },
          byteOffset: {
            type: 'integer',
            description: 'The offset into the buffer in bytes.',
            minimum: 0,
            default: 0,
          },
          byteLength: {
            type: 'integer',
            description: 'The length of the bufferView in bytes.',
            minimum: 1,
          },
          byteStride: {
            type: 'integer',
            description: 'The stride, in bytes.',
            minimum: 4,
            maximum: 252,
            multipleOf: 4,
            gltf_detailedDescription:
              'The stride, in bytes, between vertex attributes.  When this is not defined, data is tightly packed. When two or more accessors use the same buffer view, this field **MUST** be defined.',
            gltf_webgl: '`vertexAttribPointer()` stride parameter',
          },
          target: {
            description:
              'The hint representing the intended GPU buffer type to use with this buffer view.',
            gltf_webgl: '`bindBuffer()`',
            anyOf: [
              {
                const: 34962,
                description: 'ARRAY_BUFFER',
                type: 'integer',
              },
              {
                const: 34963,
                description: 'ELEMENT_ARRAY_BUFFER',
                type: 'integer',
              },
              {
                type: 'integer',
              },
            ],
          },
          name: {},
          extensions: {},
          extras: {},
        },
        required: ['buffer', 'byteLength'],
      },
      minItems: 1,
      gltf_detailedDescription:
        'An array of bufferViews.  A bufferView is a view into a buffer generally representing a subset of the buffer.',
    },
    cameras: {
      type: 'array',
      description: 'An array of cameras.',
      items: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'camera.schema.json',
        title: 'Camera',
        type: 'object',
        description:
          "A camera's projection.  A node **MAY** reference a camera to apply a transform to place the camera in the scene.",
        allOf: [
          {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'glTFChildOfRootProperty.schema.json',
            title: 'glTF Child of Root Property',
            type: 'object',
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFProperty.schema.json',
                title: 'glTF Property',
                type: 'object',
                properties: {
                  extensions: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extension.schema.json',
                    title: 'Extension',
                    type: 'object',
                    description: 'JSON object with extension-specific objects.',
                    properties: {},
                    additionalProperties: {
                      type: 'object',
                    },
                  },
                  extras: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extras.schema.json',
                    title: 'Extras',
                    description: 'Application-specific data.',
                    gltf_sectionDescription:
                      'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The user-defined name of this object.',
                gltf_detailedDescription:
                  'The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.',
              },
            },
          },
        ],
        properties: {
          orthographic: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'camera.orthographic.schema.json',
                title: 'Camera Orthographic',
                type: 'object',
                description:
                  'An orthographic camera containing properties to create an orthographic projection matrix.',
                allOf: [
                  {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'glTFProperty.schema.json',
                    title: 'glTF Property',
                    type: 'object',
                    properties: {
                      extensions: {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'extension.schema.json',
                        title: 'Extension',
                        type: 'object',
                        description: 'JSON object with extension-specific objects.',
                        properties: {},
                        additionalProperties: {
                          type: 'object',
                        },
                      },
                      extras: {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'extras.schema.json',
                        title: 'Extras',
                        description: 'Application-specific data.',
                        gltf_sectionDescription:
                          'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                      },
                    },
                  },
                ],
                properties: {
                  xmag: {
                    type: 'number',
                    description:
                      'The floating-point horizontal magnification of the view. This value **MUST NOT** be equal to zero. This value **SHOULD NOT** be negative.',
                  },
                  ymag: {
                    type: 'number',
                    description:
                      'The floating-point vertical magnification of the view. This value **MUST NOT** be equal to zero. This value **SHOULD NOT** be negative.',
                  },
                  zfar: {
                    type: 'number',
                    description:
                      'The floating-point distance to the far clipping plane. This value **MUST NOT** be equal to zero. `zfar` **MUST** be greater than `znear`.',
                    exclusiveMinimum: 0,
                  },
                  znear: {
                    type: 'number',
                    description: 'The floating-point distance to the near clipping plane.',
                    minimum: 0,
                  },
                  extensions: {},
                  extras: {},
                },
                required: ['xmag', 'ymag', 'zfar', 'znear'],
              },
            ],
            description:
              'An orthographic camera containing properties to create an orthographic projection matrix. This property **MUST NOT** be defined when `perspective` is defined.',
          },
          perspective: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'camera.perspective.schema.json',
                title: 'Camera Perspective',
                type: 'object',
                description:
                  'A perspective camera containing properties to create a perspective projection matrix.',
                allOf: [
                  {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'glTFProperty.schema.json',
                    title: 'glTF Property',
                    type: 'object',
                    properties: {
                      extensions: {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'extension.schema.json',
                        title: 'Extension',
                        type: 'object',
                        description: 'JSON object with extension-specific objects.',
                        properties: {},
                        additionalProperties: {
                          type: 'object',
                        },
                      },
                      extras: {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'extras.schema.json',
                        title: 'Extras',
                        description: 'Application-specific data.',
                        gltf_sectionDescription:
                          'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                      },
                    },
                  },
                ],
                properties: {
                  aspectRatio: {
                    type: 'number',
                    description: 'The floating-point aspect ratio of the field of view.',
                    exclusiveMinimum: 0,
                    gltf_detailedDescription:
                      'The floating-point aspect ratio of the field of view. When undefined, the aspect ratio of the rendering viewport **MUST** be used.',
                  },
                  yfov: {
                    type: 'number',
                    description:
                      'The floating-point vertical field of view in radians. This value **SHOULD** be less than π.',
                    exclusiveMinimum: 0,
                  },
                  zfar: {
                    type: 'number',
                    description: 'The floating-point distance to the far clipping plane.',
                    exclusiveMinimum: 0,
                    gltf_detailedDescription:
                      'The floating-point distance to the far clipping plane. When defined, `zfar` **MUST** be greater than `znear`. If `zfar` is undefined, client implementations **SHOULD** use infinite projection matrix.',
                  },
                  znear: {
                    type: 'number',
                    description: 'The floating-point distance to the near clipping plane.',
                    exclusiveMinimum: 0,
                    gltf_detailedDescription:
                      'The floating-point distance to the near clipping plane.',
                  },
                  extensions: {},
                  extras: {},
                },
                required: ['yfov', 'znear'],
              },
            ],
            description:
              'A perspective camera containing properties to create a perspective projection matrix. This property **MUST NOT** be defined when `orthographic` is defined.',
          },
          type: {
            description: 'Specifies if the camera uses a perspective or orthographic projection.',
            gltf_detailedDescription:
              "Specifies if the camera uses a perspective or orthographic projection.  Based on this, either the camera's `perspective` or `orthographic` property **MUST** be defined.",
            anyOf: [
              {
                const: 'perspective',
              },
              {
                const: 'orthographic',
              },
              {
                type: 'string',
              },
            ],
          },
          name: {},
          extensions: {},
          extras: {},
        },
        required: ['type'],
        not: {
          required: ['perspective', 'orthographic'],
        },
      },
      minItems: 1,
      gltf_detailedDescription: 'An array of cameras.  A camera defines a projection matrix.',
    },
    images: {
      type: 'array',
      description: 'An array of images.',
      items: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'image.schema.json',
        title: 'Image',
        type: 'object',
        description:
          'Image data used to create a texture. Image **MAY** be referenced by an URI (or IRI) or a buffer view index.',
        allOf: [
          {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'glTFChildOfRootProperty.schema.json',
            title: 'glTF Child of Root Property',
            type: 'object',
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFProperty.schema.json',
                title: 'glTF Property',
                type: 'object',
                properties: {
                  extensions: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extension.schema.json',
                    title: 'Extension',
                    type: 'object',
                    description: 'JSON object with extension-specific objects.',
                    properties: {},
                    additionalProperties: {
                      type: 'object',
                    },
                  },
                  extras: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extras.schema.json',
                    title: 'Extras',
                    description: 'Application-specific data.',
                    gltf_sectionDescription:
                      'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The user-defined name of this object.',
                gltf_detailedDescription:
                  'The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.',
              },
            },
          },
        ],
        properties: {
          uri: {
            type: 'string',
            description: 'The URI (or IRI) of the image.',
            format: 'iri-reference',
            gltf_detailedDescription:
              'The URI (or IRI) of the image.  Relative paths are relative to the current glTF asset.  Instead of referencing an external file, this field **MAY** contain a `data:`-URI. This field **MUST NOT** be defined when `bufferView` is defined.',
            gltf_uriType: 'image',
          },
          mimeType: {
            anyOf: [
              {
                const: 'image/jpeg',
              },
              {
                const: 'image/png',
              },
              {
                type: 'string',
              },
            ],
            description:
              "The image's media type. This field **MUST** be defined when `bufferView` is defined.",
          },
          bufferView: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFid.schema.json',
                title: 'glTF Id',
                type: 'integer',
                minimum: 0,
              },
            ],
            description:
              'The index of the bufferView that contains the image. This field **MUST NOT** be defined when `uri` is defined.',
          },
          name: {},
          extensions: {},
          extras: {},
        },
        dependencies: {
          bufferView: ['mimeType'],
        },
        oneOf: [
          {
            required: ['uri'],
          },
          {
            required: ['bufferView'],
          },
        ],
      },
      minItems: 1,
      gltf_detailedDescription:
        'An array of images.  An image defines data used to create a texture.',
    },
    materials: {
      type: 'array',
      description: 'An array of materials.',
      items: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'material.schema.json',
        title: 'Material',
        type: 'object',
        description: 'The material appearance of a primitive.',
        allOf: [
          {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'glTFChildOfRootProperty.schema.json',
            title: 'glTF Child of Root Property',
            type: 'object',
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFProperty.schema.json',
                title: 'glTF Property',
                type: 'object',
                properties: {
                  extensions: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extension.schema.json',
                    title: 'Extension',
                    type: 'object',
                    description: 'JSON object with extension-specific objects.',
                    properties: {},
                    additionalProperties: {
                      type: 'object',
                    },
                  },
                  extras: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extras.schema.json',
                    title: 'Extras',
                    description: 'Application-specific data.',
                    gltf_sectionDescription:
                      'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The user-defined name of this object.',
                gltf_detailedDescription:
                  'The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.',
              },
            },
          },
        ],
        properties: {
          name: {},
          extensions: {},
          extras: {},
          pbrMetallicRoughness: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'material.pbrMetallicRoughness.schema.json',
                title: 'Material PBR Metallic Roughness',
                type: 'object',
                description:
                  'A set of parameter values that are used to define the metallic-roughness material model from Physically-Based Rendering (PBR) methodology.',
                allOf: [
                  {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'glTFProperty.schema.json',
                    title: 'glTF Property',
                    type: 'object',
                    properties: {
                      extensions: {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'extension.schema.json',
                        title: 'Extension',
                        type: 'object',
                        description: 'JSON object with extension-specific objects.',
                        properties: {},
                        additionalProperties: {
                          type: 'object',
                        },
                      },
                      extras: {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'extras.schema.json',
                        title: 'Extras',
                        description: 'Application-specific data.',
                        gltf_sectionDescription:
                          'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                      },
                    },
                  },
                ],
                properties: {
                  baseColorFactor: {
                    type: 'array',
                    items: {
                      type: 'number',
                      minimum: 0,
                      maximum: 1,
                    },
                    description: 'The factors for the base color of the material.',
                    default: [1, 1, 1, 1],
                    minItems: 4,
                    maxItems: 4,
                    gltf_detailedDescription:
                      'The factors for the base color of the material. This value defines linear multipliers for the sampled texels of the base color texture.',
                  },
                  baseColorTexture: {
                    allOf: [
                      {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'textureInfo.schema.json',
                        title: 'Texture Info',
                        type: 'object',
                        description: 'Reference to a texture.',
                        allOf: [
                          {
                            $schema: 'https://json-schema.org/draft/2020-12/schema',
                            $id: 'glTFProperty.schema.json',
                            title: 'glTF Property',
                            type: 'object',
                            properties: {
                              extensions: {
                                $schema: 'https://json-schema.org/draft/2020-12/schema',
                                $id: 'extension.schema.json',
                                title: 'Extension',
                                type: 'object',
                                description: 'JSON object with extension-specific objects.',
                                properties: {},
                                additionalProperties: {
                                  type: 'object',
                                },
                              },
                              extras: {
                                $schema: 'https://json-schema.org/draft/2020-12/schema',
                                $id: 'extras.schema.json',
                                title: 'Extras',
                                description: 'Application-specific data.',
                                gltf_sectionDescription:
                                  'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                              },
                            },
                          },
                        ],
                        properties: {
                          index: {
                            allOf: [
                              {
                                $schema: 'https://json-schema.org/draft/2020-12/schema',
                                $id: 'glTFid.schema.json',
                                title: 'glTF Id',
                                type: 'integer',
                                minimum: 0,
                              },
                            ],
                            description: 'The index of the texture.',
                          },
                          texCoord: {
                            type: 'integer',
                            description:
                              "The set index of texture's TEXCOORD attribute used for texture coordinate mapping.",
                            default: 0,
                            minimum: 0,
                            gltf_detailedDescription:
                              'This integer value is used to construct a string in the format `TEXCOORD_<set index>` which is a reference to a key in `mesh.primitives.attributes` (e.g. a value of `0` corresponds to `TEXCOORD_0`). A mesh primitive **MUST** have the corresponding texture coordinate attributes for the material to be applicable to it.',
                          },
                          extensions: {},
                          extras: {},
                        },
                        required: ['index'],
                      },
                    ],
                    description: 'The base color texture.',
                    gltf_detailedDescription:
                      'The base color texture. The first three components (RGB) **MUST** be encoded with the sRGB transfer function. They specify the base color of the material. If the fourth component (A) is present, it represents the linear alpha coverage of the material. Otherwise, the alpha coverage is equal to `1.0`. The `material.alphaMode` property specifies how alpha is interpreted. The stored texels **MUST NOT** be premultiplied. When undefined, the texture **MUST** be sampled as having `1.0` in all components.',
                  },
                  metallicFactor: {
                    type: 'number',
                    description: 'The factor for the metalness of the material.',
                    default: 1,
                    minimum: 0,
                    maximum: 1,
                    gltf_detailedDescription:
                      'The factor for the metalness of the material. This value defines a linear multiplier for the sampled metalness values of the metallic-roughness texture.',
                  },
                  roughnessFactor: {
                    type: 'number',
                    description: 'The factor for the roughness of the material.',
                    default: 1,
                    minimum: 0,
                    maximum: 1,
                    gltf_detailedDescription:
                      'The factor for the roughness of the material. This value defines a linear multiplier for the sampled roughness values of the metallic-roughness texture.',
                  },
                  metallicRoughnessTexture: {
                    allOf: [
                      {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'textureInfo.schema.json',
                        title: 'Texture Info',
                        type: 'object',
                        description: 'Reference to a texture.',
                        allOf: [
                          {
                            $schema: 'https://json-schema.org/draft/2020-12/schema',
                            $id: 'glTFProperty.schema.json',
                            title: 'glTF Property',
                            type: 'object',
                            properties: {
                              extensions: {
                                $schema: 'https://json-schema.org/draft/2020-12/schema',
                                $id: 'extension.schema.json',
                                title: 'Extension',
                                type: 'object',
                                description: 'JSON object with extension-specific objects.',
                                properties: {},
                                additionalProperties: {
                                  type: 'object',
                                },
                              },
                              extras: {
                                $schema: 'https://json-schema.org/draft/2020-12/schema',
                                $id: 'extras.schema.json',
                                title: 'Extras',
                                description: 'Application-specific data.',
                                gltf_sectionDescription:
                                  'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                              },
                            },
                          },
                        ],
                        properties: {
                          index: {
                            allOf: [
                              {
                                $schema: 'https://json-schema.org/draft/2020-12/schema',
                                $id: 'glTFid.schema.json',
                                title: 'glTF Id',
                                type: 'integer',
                                minimum: 0,
                              },
                            ],
                            description: 'The index of the texture.',
                          },
                          texCoord: {
                            type: 'integer',
                            description:
                              "The set index of texture's TEXCOORD attribute used for texture coordinate mapping.",
                            default: 0,
                            minimum: 0,
                            gltf_detailedDescription:
                              'This integer value is used to construct a string in the format `TEXCOORD_<set index>` which is a reference to a key in `mesh.primitives.attributes` (e.g. a value of `0` corresponds to `TEXCOORD_0`). A mesh primitive **MUST** have the corresponding texture coordinate attributes for the material to be applicable to it.',
                          },
                          extensions: {},
                          extras: {},
                        },
                        required: ['index'],
                      },
                    ],
                    description: 'The metallic-roughness texture.',
                    gltf_detailedDescription:
                      'The metallic-roughness texture. The metalness values are sampled from the B channel. The roughness values are sampled from the G channel. These values **MUST** be encoded with a linear transfer function. If other channels are present (R or A), they **MUST** be ignored for metallic-roughness calculations. When undefined, the texture **MUST** be sampled as having `1.0` in G and B components.',
                  },
                  extensions: {},
                  extras: {},
                },
              },
            ],
            description:
              'A set of parameter values that are used to define the metallic-roughness material model from Physically Based Rendering (PBR) methodology. When undefined, all the default values of `pbrMetallicRoughness` **MUST** apply.',
          },
          normalTexture: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'material.normalTextureInfo.schema.json',
                title: 'Material Normal Texture Info',
                type: 'object',
                allOf: [
                  {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'textureInfo.schema.json',
                    title: 'Texture Info',
                    type: 'object',
                    description: 'Reference to a texture.',
                    allOf: [
                      {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'glTFProperty.schema.json',
                        title: 'glTF Property',
                        type: 'object',
                        properties: {
                          extensions: {
                            $schema: 'https://json-schema.org/draft/2020-12/schema',
                            $id: 'extension.schema.json',
                            title: 'Extension',
                            type: 'object',
                            description: 'JSON object with extension-specific objects.',
                            properties: {},
                            additionalProperties: {
                              type: 'object',
                            },
                          },
                          extras: {
                            $schema: 'https://json-schema.org/draft/2020-12/schema',
                            $id: 'extras.schema.json',
                            title: 'Extras',
                            description: 'Application-specific data.',
                            gltf_sectionDescription:
                              'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                          },
                        },
                      },
                    ],
                    properties: {
                      index: {
                        allOf: [
                          {
                            $schema: 'https://json-schema.org/draft/2020-12/schema',
                            $id: 'glTFid.schema.json',
                            title: 'glTF Id',
                            type: 'integer',
                            minimum: 0,
                          },
                        ],
                        description: 'The index of the texture.',
                      },
                      texCoord: {
                        type: 'integer',
                        description:
                          "The set index of texture's TEXCOORD attribute used for texture coordinate mapping.",
                        default: 0,
                        minimum: 0,
                        gltf_detailedDescription:
                          'This integer value is used to construct a string in the format `TEXCOORD_<set index>` which is a reference to a key in `mesh.primitives.attributes` (e.g. a value of `0` corresponds to `TEXCOORD_0`). A mesh primitive **MUST** have the corresponding texture coordinate attributes for the material to be applicable to it.',
                      },
                      extensions: {},
                      extras: {},
                    },
                    required: ['index'],
                  },
                ],
                properties: {
                  index: {},
                  texCoord: {},
                  scale: {
                    type: 'number',
                    description:
                      'The scalar parameter applied to each normal vector of the normal texture.',
                    default: 1,
                    gltf_detailedDescription:
                      'The scalar parameter applied to each normal vector of the texture. This value scales the normal vector in X and Y directions using the formula: `scaledNormal =  normalize((<sampled normal texture value> * 2.0 - 1.0) * vec3(<normal scale>, <normal scale>, 1.0))`.',
                  },
                  extensions: {},
                  extras: {},
                },
              },
            ],
            description: 'The tangent space normal texture.',
            gltf_detailedDescription:
              'The tangent space normal texture. The texture encodes RGB components with linear transfer function. Each texel represents the XYZ components of a normal vector in tangent space. The normal vectors use the convention +X is right and +Y is up. +Z points toward the viewer. If a fourth component (A) is present, it **MUST** be ignored. When undefined, the material does not have a tangent space normal texture.',
          },
          occlusionTexture: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'material.occlusionTextureInfo.schema.json',
                title: 'Material Occlusion Texture Info',
                type: 'object',
                allOf: [
                  {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'textureInfo.schema.json',
                    title: 'Texture Info',
                    type: 'object',
                    description: 'Reference to a texture.',
                    allOf: [
                      {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'glTFProperty.schema.json',
                        title: 'glTF Property',
                        type: 'object',
                        properties: {
                          extensions: {
                            $schema: 'https://json-schema.org/draft/2020-12/schema',
                            $id: 'extension.schema.json',
                            title: 'Extension',
                            type: 'object',
                            description: 'JSON object with extension-specific objects.',
                            properties: {},
                            additionalProperties: {
                              type: 'object',
                            },
                          },
                          extras: {
                            $schema: 'https://json-schema.org/draft/2020-12/schema',
                            $id: 'extras.schema.json',
                            title: 'Extras',
                            description: 'Application-specific data.',
                            gltf_sectionDescription:
                              'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                          },
                        },
                      },
                    ],
                    properties: {
                      index: {
                        allOf: [
                          {
                            $schema: 'https://json-schema.org/draft/2020-12/schema',
                            $id: 'glTFid.schema.json',
                            title: 'glTF Id',
                            type: 'integer',
                            minimum: 0,
                          },
                        ],
                        description: 'The index of the texture.',
                      },
                      texCoord: {
                        type: 'integer',
                        description:
                          "The set index of texture's TEXCOORD attribute used for texture coordinate mapping.",
                        default: 0,
                        minimum: 0,
                        gltf_detailedDescription:
                          'This integer value is used to construct a string in the format `TEXCOORD_<set index>` which is a reference to a key in `mesh.primitives.attributes` (e.g. a value of `0` corresponds to `TEXCOORD_0`). A mesh primitive **MUST** have the corresponding texture coordinate attributes for the material to be applicable to it.',
                      },
                      extensions: {},
                      extras: {},
                    },
                    required: ['index'],
                  },
                ],
                properties: {
                  index: {},
                  texCoord: {},
                  strength: {
                    type: 'number',
                    description: 'A scalar multiplier controlling the amount of occlusion applied.',
                    default: 1,
                    minimum: 0,
                    maximum: 1,
                    gltf_detailedDescription:
                      'A scalar parameter controlling the amount of occlusion applied. A value of `0.0` means no occlusion. A value of `1.0` means full occlusion. This value affects the final occlusion value as: `1.0 + strength * (<sampled occlusion texture value> - 1.0)`.',
                  },
                  extensions: {},
                  extras: {},
                },
              },
            ],
            description: 'The occlusion texture.',
            gltf_detailedDescription:
              'The occlusion texture. The occlusion values are linearly sampled from the R channel. Higher values indicate areas that receive full indirect lighting and lower values indicate no indirect lighting. If other channels are present (GBA), they **MUST** be ignored for occlusion calculations. When undefined, the material does not have an occlusion texture.',
          },
          emissiveTexture: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'textureInfo.schema.json',
                title: 'Texture Info',
                type: 'object',
                description: 'Reference to a texture.',
                allOf: [
                  {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'glTFProperty.schema.json',
                    title: 'glTF Property',
                    type: 'object',
                    properties: {
                      extensions: {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'extension.schema.json',
                        title: 'Extension',
                        type: 'object',
                        description: 'JSON object with extension-specific objects.',
                        properties: {},
                        additionalProperties: {
                          type: 'object',
                        },
                      },
                      extras: {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'extras.schema.json',
                        title: 'Extras',
                        description: 'Application-specific data.',
                        gltf_sectionDescription:
                          'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                      },
                    },
                  },
                ],
                properties: {
                  index: {
                    allOf: [
                      {
                        $schema: 'https://json-schema.org/draft/2020-12/schema',
                        $id: 'glTFid.schema.json',
                        title: 'glTF Id',
                        type: 'integer',
                        minimum: 0,
                      },
                    ],
                    description: 'The index of the texture.',
                  },
                  texCoord: {
                    type: 'integer',
                    description:
                      "The set index of texture's TEXCOORD attribute used for texture coordinate mapping.",
                    default: 0,
                    minimum: 0,
                    gltf_detailedDescription:
                      'This integer value is used to construct a string in the format `TEXCOORD_<set index>` which is a reference to a key in `mesh.primitives.attributes` (e.g. a value of `0` corresponds to `TEXCOORD_0`). A mesh primitive **MUST** have the corresponding texture coordinate attributes for the material to be applicable to it.',
                  },
                  extensions: {},
                  extras: {},
                },
                required: ['index'],
              },
            ],
            description: 'The emissive texture.',
            gltf_detailedDescription:
              'The emissive texture. It controls the color and intensity of the light being emitted by the material. This texture contains RGB components encoded with the sRGB transfer function. If a fourth component (A) is present, it **MUST** be ignored. When undefined, the texture **MUST** be sampled as having `1.0` in RGB components.',
          },
          emissiveFactor: {
            type: 'array',
            items: {
              type: 'number',
              minimum: 0,
              maximum: 1,
            },
            minItems: 3,
            maxItems: 3,
            default: [0, 0, 0],
            description: 'The factors for the emissive color of the material.',
            gltf_detailedDescription:
              'The factors for the emissive color of the material. This value defines linear multipliers for the sampled texels of the emissive texture.',
          },
          alphaMode: {
            default: 'OPAQUE',
            description: 'The alpha rendering mode of the material.',
            gltf_detailedDescription:
              "The material's alpha rendering mode enumeration specifying the interpretation of the alpha value of the base color.",
            anyOf: [
              {
                const: 'OPAQUE',
                description: 'The alpha value is ignored, and the rendered output is fully opaque.',
              },
              {
                const: 'MASK',
                description:
                  'The rendered output is either fully opaque or fully transparent depending on the alpha value and the specified `alphaCutoff` value; the exact appearance of the edges **MAY** be subject to implementation-specific techniques such as "`Alpha-to-Coverage`".',
              },
              {
                const: 'BLEND',
                description:
                  'The alpha value is used to composite the source and destination areas. The rendered output is combined with the background using the normal painting operation (i.e. the Porter and Duff over operator).',
              },
              {
                type: 'string',
              },
            ],
          },
          alphaCutoff: {
            type: 'number',
            minimum: 0,
            default: 0.5,
            description: 'The alpha cutoff value of the material.',
            gltf_detailedDescription:
              'Specifies the cutoff threshold when in `MASK` alpha mode. If the alpha value is greater than or equal to this value then it is rendered as fully opaque, otherwise, it is rendered as fully transparent. A value greater than `1.0` will render the entire material as fully transparent. This value **MUST** be ignored for other alpha modes. When `alphaMode` is not defined, this value **MUST NOT** be defined.',
          },
          doubleSided: {
            type: 'boolean',
            default: false,
            description: 'Specifies whether the material is double sided.',
            gltf_detailedDescription:
              'Specifies whether the material is double sided. When this value is false, back-face culling is enabled. When this value is true, back-face culling is disabled and double-sided lighting is enabled. The back-face **MUST** have its normals reversed before the lighting equation is evaluated.',
          },
        },
        dependencies: {
          alphaCutoff: ['alphaMode'],
        },
      },
      minItems: 1,
      gltf_detailedDescription:
        'An array of materials.  A material defines the appearance of a primitive.',
    },
    meshes: {
      type: 'array',
      description: 'An array of meshes.',
      items: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'mesh.schema.json',
        title: 'Mesh',
        type: 'object',
        description:
          'A set of primitives to be rendered.  Its global transform is defined by a node that references it.',
        allOf: [
          {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'glTFChildOfRootProperty.schema.json',
            title: 'glTF Child of Root Property',
            type: 'object',
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFProperty.schema.json',
                title: 'glTF Property',
                type: 'object',
                properties: {
                  extensions: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extension.schema.json',
                    title: 'Extension',
                    type: 'object',
                    description: 'JSON object with extension-specific objects.',
                    properties: {},
                    additionalProperties: {
                      type: 'object',
                    },
                  },
                  extras: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extras.schema.json',
                    title: 'Extras',
                    description: 'Application-specific data.',
                    gltf_sectionDescription:
                      'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The user-defined name of this object.',
                gltf_detailedDescription:
                  'The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.',
              },
            },
          },
        ],
        properties: {
          primitives: {
            type: 'array',
            description: 'An array of primitives, each defining geometry to be rendered.',
            items: {
              $schema: 'https://json-schema.org/draft/2020-12/schema',
              $id: 'mesh.primitive.schema.json',
              title: 'Mesh Primitive',
              type: 'object',
              description: 'Geometry to be rendered with the given material.',
              allOf: [
                {
                  $schema: 'https://json-schema.org/draft/2020-12/schema',
                  $id: 'glTFProperty.schema.json',
                  title: 'glTF Property',
                  type: 'object',
                  properties: {
                    extensions: {
                      $schema: 'https://json-schema.org/draft/2020-12/schema',
                      $id: 'extension.schema.json',
                      title: 'Extension',
                      type: 'object',
                      description: 'JSON object with extension-specific objects.',
                      properties: {},
                      additionalProperties: {
                        type: 'object',
                      },
                    },
                    extras: {
                      $schema: 'https://json-schema.org/draft/2020-12/schema',
                      $id: 'extras.schema.json',
                      title: 'Extras',
                      description: 'Application-specific data.',
                      gltf_sectionDescription:
                        'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                    },
                  },
                },
              ],
              properties: {
                attributes: {
                  type: 'object',
                  description:
                    "A plain JSON object, where each key corresponds to a mesh attribute semantic and each value is the index of the accessor containing attribute's data.",
                  minProperties: 1,
                  additionalProperties: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'glTFid.schema.json',
                    title: 'glTF Id',
                    type: 'integer',
                    minimum: 0,
                  },
                },
                indices: {
                  allOf: [
                    {
                      $schema: 'https://json-schema.org/draft/2020-12/schema',
                      $id: 'glTFid.schema.json',
                      title: 'glTF Id',
                      type: 'integer',
                      minimum: 0,
                    },
                  ],
                  description: 'The index of the accessor that contains the vertex indices.',
                  gltf_detailedDescription:
                    'The index of the accessor that contains the vertex indices.  When this is undefined, the primitive defines non-indexed geometry.  When defined, the accessor **MUST** have `SCALAR` type and an unsigned integer component type.',
                  gltf_webgl: '`drawElements()` when defined and `drawArrays()` otherwise.',
                },
                material: {
                  allOf: [
                    {
                      $schema: 'https://json-schema.org/draft/2020-12/schema',
                      $id: 'glTFid.schema.json',
                      title: 'glTF Id',
                      type: 'integer',
                      minimum: 0,
                    },
                  ],
                  description:
                    'The index of the material to apply to this primitive when rendering.',
                },
                mode: {
                  description: 'The topology type of primitives to render.',
                  default: 4,
                  anyOf: [
                    {
                      const: 0,
                      description: 'POINTS',
                      type: 'integer',
                    },
                    {
                      const: 1,
                      description: 'LINES',
                      type: 'integer',
                    },
                    {
                      const: 2,
                      description: 'LINE_LOOP',
                      type: 'integer',
                    },
                    {
                      const: 3,
                      description: 'LINE_STRIP',
                      type: 'integer',
                    },
                    {
                      const: 4,
                      description: 'TRIANGLES',
                      type: 'integer',
                    },
                    {
                      const: 5,
                      description: 'TRIANGLE_STRIP',
                      type: 'integer',
                    },
                    {
                      const: 6,
                      description: 'TRIANGLE_FAN',
                      type: 'integer',
                    },
                    {
                      type: 'integer',
                    },
                  ],
                },
                targets: {
                  type: 'array',
                  description: 'An array of morph targets.',
                  items: {
                    type: 'object',
                    minProperties: 1,
                    additionalProperties: {
                      $schema: 'https://json-schema.org/draft/2020-12/schema',
                      $id: 'glTFid.schema.json',
                      title: 'glTF Id',
                      type: 'integer',
                      minimum: 0,
                    },
                    description:
                      "A plain JSON object specifying attributes displacements in a morph target, where each key corresponds to one of the three supported attribute semantic (`POSITION`, `NORMAL`, or `TANGENT`) and each value is the index of the accessor containing the attribute displacements' data.",
                  },
                  minItems: 1,
                },
                extensions: {},
                extras: {},
              },
              gltf_webgl: '`drawElements()` and `drawArrays()`',
              required: ['attributes'],
            },
            minItems: 1,
          },
          weights: {
            type: 'array',
            description:
              'Array of weights to be applied to the morph targets. The number of array elements **MUST** match the number of morph targets.',
            items: {
              type: 'number',
            },
            minItems: 1,
          },
          name: {},
          extensions: {},
          extras: {},
        },
        required: ['primitives'],
      },
      minItems: 1,
      gltf_detailedDescription:
        'An array of meshes.  A mesh is a set of primitives to be rendered.',
    },
    nodes: {
      type: 'array',
      description: 'An array of nodes.',
      items: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'node.schema.json',
        title: 'Node',
        type: 'object',
        description:
          'A node in the node hierarchy.  When the node contains `skin`, all `mesh.primitives` **MUST** contain `JOINTS_0` and `WEIGHTS_0` attributes.  A node **MAY** have either a `matrix` or any combination of `translation`/`rotation`/`scale` (TRS) properties. TRS properties are converted to matrices and postmultiplied in the `T * R * S` order to compose the transformation matrix; first the scale is applied to the vertices, then the rotation, and then the translation. If none are provided, the transform is the identity. When a node is targeted for animation (referenced by an animation.channel.target), `matrix` **MUST NOT** be present.',
        allOf: [
          {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'glTFChildOfRootProperty.schema.json',
            title: 'glTF Child of Root Property',
            type: 'object',
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFProperty.schema.json',
                title: 'glTF Property',
                type: 'object',
                properties: {
                  extensions: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extension.schema.json',
                    title: 'Extension',
                    type: 'object',
                    description: 'JSON object with extension-specific objects.',
                    properties: {},
                    additionalProperties: {
                      type: 'object',
                    },
                  },
                  extras: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extras.schema.json',
                    title: 'Extras',
                    description: 'Application-specific data.',
                    gltf_sectionDescription:
                      'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The user-defined name of this object.',
                gltf_detailedDescription:
                  'The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.',
              },
            },
          },
        ],
        properties: {
          camera: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFid.schema.json',
                title: 'glTF Id',
                type: 'integer',
                minimum: 0,
              },
            ],
            description: 'The index of the camera referenced by this node.',
          },
          children: {
            type: 'array',
            description: "The indices of this node's children.",
            items: {
              $schema: 'https://json-schema.org/draft/2020-12/schema',
              $id: 'glTFid.schema.json',
              title: 'glTF Id',
              type: 'integer',
              minimum: 0,
            },
            uniqueItems: true,
            minItems: 1,
          },
          skin: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFid.schema.json',
                title: 'glTF Id',
                type: 'integer',
                minimum: 0,
              },
            ],
            description: 'The index of the skin referenced by this node.',
            gltf_detailedDescription:
              'The index of the skin referenced by this node. When a skin is referenced by a node within a scene, all joints used by the skin **MUST** belong to the same scene. When defined, `mesh` **MUST** also be defined.',
          },
          matrix: {
            type: 'array',
            description: 'A floating-point 4x4 transformation matrix stored in column-major order.',
            items: {
              type: 'number',
            },
            minItems: 16,
            maxItems: 16,
            default: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            gltf_webgl: '`uniformMatrix4fv()` with the transpose parameter equal to false',
          },
          mesh: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFid.schema.json',
                title: 'glTF Id',
                type: 'integer',
                minimum: 0,
              },
            ],
            description: 'The index of the mesh in this node.',
          },
          rotation: {
            type: 'array',
            description:
              "The node's unit quaternion rotation in the order (x, y, z, w), where w is the scalar.",
            items: {
              type: 'number',
              minimum: -1,
              maximum: 1,
            },
            minItems: 4,
            maxItems: 4,
            default: [0, 0, 0, 1],
          },
          scale: {
            type: 'array',
            description:
              "The node's non-uniform scale, given as the scaling factors along the x, y, and z axes.",
            items: {
              type: 'number',
            },
            minItems: 3,
            maxItems: 3,
            default: [1, 1, 1],
          },
          translation: {
            type: 'array',
            description: "The node's translation along the x, y, and z axes.",
            items: {
              type: 'number',
            },
            minItems: 3,
            maxItems: 3,
            default: [0, 0, 0],
          },
          weights: {
            type: 'array',
            description:
              'The weights of the instantiated morph target. The number of array elements **MUST** match the number of morph targets of the referenced mesh. When defined, `mesh` **MUST** also be defined.',
            minItems: 1,
            items: {
              type: 'number',
            },
          },
          name: {},
          extensions: {},
          extras: {},
        },
        dependencies: {
          weights: ['mesh'],
          skin: ['mesh'],
        },
        not: {
          anyOf: [
            {
              required: ['matrix', 'translation'],
            },
            {
              required: ['matrix', 'rotation'],
            },
            {
              required: ['matrix', 'scale'],
            },
          ],
        },
      },
      minItems: 1,
    },
    samplers: {
      type: 'array',
      description: 'An array of samplers.',
      items: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'sampler.schema.json',
        title: 'Sampler',
        type: 'object',
        description: 'Texture sampler properties for filtering and wrapping modes.',
        allOf: [
          {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'glTFChildOfRootProperty.schema.json',
            title: 'glTF Child of Root Property',
            type: 'object',
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFProperty.schema.json',
                title: 'glTF Property',
                type: 'object',
                properties: {
                  extensions: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extension.schema.json',
                    title: 'Extension',
                    type: 'object',
                    description: 'JSON object with extension-specific objects.',
                    properties: {},
                    additionalProperties: {
                      type: 'object',
                    },
                  },
                  extras: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extras.schema.json',
                    title: 'Extras',
                    description: 'Application-specific data.',
                    gltf_sectionDescription:
                      'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The user-defined name of this object.',
                gltf_detailedDescription:
                  'The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.',
              },
            },
          },
        ],
        properties: {
          magFilter: {
            description: 'Magnification filter.',
            gltf_webgl: '`samplerParameteri()` with pname equal to TEXTURE_MAG_FILTER',
            anyOf: [
              {
                const: 9728,
                description: 'NEAREST',
                type: 'integer',
              },
              {
                const: 9729,
                description: 'LINEAR',
                type: 'integer',
              },
              {
                type: 'integer',
              },
            ],
          },
          minFilter: {
            description: 'Minification filter.',
            gltf_webgl: '`samplerParameteri()` with pname equal to TEXTURE_MIN_FILTER',
            anyOf: [
              {
                const: 9728,
                description: 'NEAREST',
                type: 'integer',
              },
              {
                const: 9729,
                description: 'LINEAR',
                type: 'integer',
              },
              {
                const: 9984,
                description: 'NEAREST_MIPMAP_NEAREST',
                type: 'integer',
              },
              {
                const: 9985,
                description: 'LINEAR_MIPMAP_NEAREST',
                type: 'integer',
              },
              {
                const: 9986,
                description: 'NEAREST_MIPMAP_LINEAR',
                type: 'integer',
              },
              {
                const: 9987,
                description: 'LINEAR_MIPMAP_LINEAR',
                type: 'integer',
              },
              {
                type: 'integer',
              },
            ],
          },
          wrapS: {
            description: 'S (U) wrapping mode.',
            default: 10497,
            gltf_detailedDescription:
              'S (U) wrapping mode.  All valid values correspond to WebGL enums.',
            gltf_webgl: '`samplerParameteri()` with pname equal to TEXTURE_WRAP_S',
            anyOf: [
              {
                const: 33071,
                description: 'CLAMP_TO_EDGE',
                type: 'integer',
              },
              {
                const: 33648,
                description: 'MIRRORED_REPEAT',
                type: 'integer',
              },
              {
                const: 10497,
                description: 'REPEAT',
                type: 'integer',
              },
              {
                type: 'integer',
              },
            ],
          },
          wrapT: {
            description: 'T (V) wrapping mode.',
            default: 10497,
            gltf_webgl: '`samplerParameteri()` with pname equal to TEXTURE_WRAP_T',
            anyOf: [
              {
                const: 33071,
                description: 'CLAMP_TO_EDGE',
                type: 'integer',
              },
              {
                const: 33648,
                description: 'MIRRORED_REPEAT',
                type: 'integer',
              },
              {
                const: 10497,
                description: 'REPEAT',
                type: 'integer',
              },
              {
                type: 'integer',
              },
            ],
          },
          name: {},
          extensions: {},
          extras: {},
        },
      },
      minItems: 1,
      gltf_detailedDescription:
        'An array of samplers.  A sampler contains properties for texture filtering and wrapping modes.',
    },
    scene: {
      allOf: [
        {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          $id: 'glTFid.schema.json',
          title: 'glTF Id',
          type: 'integer',
          minimum: 0,
        },
      ],
      description: 'The index of the default scene.',
      gltf_detailedDescription:
        'The index of the default scene.  This property **MUST NOT** be defined, when `scenes` is undefined.',
    },
    scenes: {
      type: 'array',
      description: 'An array of scenes.',
      items: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'scene.schema.json',
        title: 'Scene',
        type: 'object',
        description: 'The root nodes of a scene.',
        allOf: [
          {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'glTFChildOfRootProperty.schema.json',
            title: 'glTF Child of Root Property',
            type: 'object',
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFProperty.schema.json',
                title: 'glTF Property',
                type: 'object',
                properties: {
                  extensions: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extension.schema.json',
                    title: 'Extension',
                    type: 'object',
                    description: 'JSON object with extension-specific objects.',
                    properties: {},
                    additionalProperties: {
                      type: 'object',
                    },
                  },
                  extras: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extras.schema.json',
                    title: 'Extras',
                    description: 'Application-specific data.',
                    gltf_sectionDescription:
                      'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The user-defined name of this object.',
                gltf_detailedDescription:
                  'The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.',
              },
            },
          },
        ],
        properties: {
          nodes: {
            type: 'array',
            description: 'The indices of each root node.',
            items: {
              $schema: 'https://json-schema.org/draft/2020-12/schema',
              $id: 'glTFid.schema.json',
              title: 'glTF Id',
              type: 'integer',
              minimum: 0,
            },
            uniqueItems: true,
            minItems: 1,
          },
          name: {},
          extensions: {},
          extras: {},
        },
      },
      minItems: 1,
    },
    skins: {
      type: 'array',
      description: 'An array of skins.',
      items: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'skin.schema.json',
        title: 'Skin',
        type: 'object',
        description: 'Joints and matrices defining a skin.',
        allOf: [
          {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'glTFChildOfRootProperty.schema.json',
            title: 'glTF Child of Root Property',
            type: 'object',
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFProperty.schema.json',
                title: 'glTF Property',
                type: 'object',
                properties: {
                  extensions: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extension.schema.json',
                    title: 'Extension',
                    type: 'object',
                    description: 'JSON object with extension-specific objects.',
                    properties: {},
                    additionalProperties: {
                      type: 'object',
                    },
                  },
                  extras: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extras.schema.json',
                    title: 'Extras',
                    description: 'Application-specific data.',
                    gltf_sectionDescription:
                      'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The user-defined name of this object.',
                gltf_detailedDescription:
                  'The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.',
              },
            },
          },
        ],
        properties: {
          inverseBindMatrices: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFid.schema.json',
                title: 'glTF Id',
                type: 'integer',
                minimum: 0,
              },
            ],
            description:
              'The index of the accessor containing the floating-point 4x4 inverse-bind matrices.',
            gltf_detailedDescription:
              'The index of the accessor containing the floating-point 4x4 inverse-bind matrices. Its `accessor.count` property **MUST** be greater than or equal to the number of elements of the `joints` array. When undefined, each matrix is a 4x4 identity matrix.',
          },
          skeleton: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFid.schema.json',
                title: 'glTF Id',
                type: 'integer',
                minimum: 0,
              },
            ],
            description: 'The index of the node used as a skeleton root.',
            gltf_detailedDescription:
              'The index of the node used as a skeleton root. The node **MUST** be the closest common root of the joints hierarchy or a direct or indirect parent node of the closest common root.',
          },
          joints: {
            type: 'array',
            description: 'Indices of skeleton nodes, used as joints in this skin.',
            items: {
              $schema: 'https://json-schema.org/draft/2020-12/schema',
              $id: 'glTFid.schema.json',
              title: 'glTF Id',
              type: 'integer',
              minimum: 0,
            },
            uniqueItems: true,
            minItems: 1,
            gltf_detailedDescription: 'Indices of skeleton nodes, used as joints in this skin.',
          },
          name: {},
          extensions: {},
          extras: {},
        },
        required: ['joints'],
      },
      minItems: 1,
      gltf_detailedDescription: 'An array of skins.  A skin is defined by joints and matrices.',
    },
    textures: {
      type: 'array',
      description: 'An array of textures.',
      items: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'texture.schema.json',
        title: 'Texture',
        type: 'object',
        description: 'A texture and its sampler.',
        allOf: [
          {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'glTFChildOfRootProperty.schema.json',
            title: 'glTF Child of Root Property',
            type: 'object',
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFProperty.schema.json',
                title: 'glTF Property',
                type: 'object',
                properties: {
                  extensions: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extension.schema.json',
                    title: 'Extension',
                    type: 'object',
                    description: 'JSON object with extension-specific objects.',
                    properties: {},
                    additionalProperties: {
                      type: 'object',
                    },
                  },
                  extras: {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    $id: 'extras.schema.json',
                    title: 'Extras',
                    description: 'Application-specific data.',
                    gltf_sectionDescription:
                      'Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The user-defined name of this object.',
                gltf_detailedDescription:
                  'The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.',
              },
            },
          },
        ],
        properties: {
          sampler: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFid.schema.json',
                title: 'glTF Id',
                type: 'integer',
                minimum: 0,
              },
            ],
            description:
              'The index of the sampler used by this texture. When undefined, a sampler with repeat wrapping and auto filtering **SHOULD** be used.',
          },
          source: {
            allOf: [
              {
                $schema: 'https://json-schema.org/draft/2020-12/schema',
                $id: 'glTFid.schema.json',
                title: 'glTF Id',
                type: 'integer',
                minimum: 0,
              },
            ],
            description:
              'The index of the image used by this texture. When undefined, an extension or other mechanism **SHOULD** supply an alternate texture source, otherwise behavior is undefined.',
          },
          name: {},
          extensions: {},
          extras: {},
        },
        gltf_webgl:
          '`createTexture()`, `deleteTexture()`, `bindTexture()`, `texImage2D()`, and `texParameterf()`',
      },
      minItems: 1,
    },
    extensions: {},
    extras: {},
  },
  dependencies: {
    scene: ['scenes'],
  },
  required: ['asset'],
} as const

type S = typeof jsonSchema
type X = S['properties']['asset']['allOf'][0]
type XK = GetKeys<X>

type Foo = ExtractAllOf<X>
type FOOO = FromJsonSchema<Foo[0]['properties']['extensions']>

type XALL = FromJsonSchemaMap<X>['AllOf']
type XO = FromJsonSchema<X>
type XO2 = { readonly [K in keyof XO]: XO[K] }
type Output = FromJsonSchema<typeof jsonSchema>
