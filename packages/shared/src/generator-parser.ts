import { GeneratorConfig, GenerationMode } from 'iot-simulator-api'
import { builderOf } from './builder'

const parseConfig = (config: string) => {
  const matches = config.match(/^^([^:]+):([^:]+):(.+)$/) || ['', '', '', '']

  return builderOf<GeneratorConfig>()
    .mode((GenerationMode as any)[matches[1]])
    .pluginId(matches[2])
    .config(matches[3])
    .build()
}

export { parseConfig }
