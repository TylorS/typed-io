import { extname, join } from 'path'

import yargs from 'yargs'

import { generateDecoder } from './generateDecoder'

main()
  .then((output) => {
    console.log(`Generated JSON Schema Decoder at ${output}!`)
  })
  .catch((error) => {
    console.error(`Failure generating JSON Schema Decoder:`, error)
  })

async function main() {
  const { input, output, cwd } = await yargs
    .option('input', {
      type: 'string',
      description: 'JSON Schema to Process',
      required: true,
    })
    .option('output', {
      type: 'string',
      description: 'Output Path for dereferenced JSON-Schema + Decoder',
      required: true,
    })
    .option('cwd', {
      type: 'string',
      default: process.cwd(),
    }).argv

  await generateDecoder(join(cwd, input), join(cwd, ensureTsFileExt(output)))

  return output
}

function ensureTsFileExt(output: string) {
  const ext = extname(output)

  if (/[c|m]?tsx?/.test(ext)) {
    return output
  }

  return output.replace(new RegExp(`${ext}$`), '.ts')
}
