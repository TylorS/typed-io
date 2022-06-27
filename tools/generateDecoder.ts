import { writeFile } from 'fs/promises'
import { dirname } from 'path'

import deref from 'json-schema-deref-sync'

export async function generateDecoder(pathToJsonSchema: string, outputPath: string) {
  const schema = await import(pathToJsonSchema, {
    assert: {
      type: 'json',
    },
  })
  const dereferenced = deref(schema, { baseFolder: dirname(pathToJsonSchema) })

  const output = `import { fromJsonSchema } from '@typed/io/Decoder/fromJsonSchema'

const jsonSchema = ${JSON.stringify(dereferenced, null, 2)} as const

export const decoder = fromJsonSchema(jsonSchema)
  `

  await writeFile(outputPath, output)
}
