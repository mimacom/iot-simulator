import { builderOf } from 'iot-simulator-shared'

export interface GenerationConfig {
  mode: GenerationMode
  pluginId: string
  config: any
}

export enum GenerationMode {
  INIT,
  TICK
}

export const parseConfig = (config: string) => {
  const matches = config.match(/^^([^:]+):([^:]+):(.+)$/) || ['', '', '']

  return builderOf<GenerationConfig>()
    .mode((GenerationMode as any)[matches[0]])
    .pluginId(matches[1])
    .config(matches[2])
    .build()
}
