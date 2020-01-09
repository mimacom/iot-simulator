import { Sensor } from './sensor'
import { GenerationConfig } from './generation-config'

export interface Device {
  id: string | GenerationConfig
  instances: number | GenerationConfig
  metadata: Metadata
  sensors?: Sensor[]
  devices?: Device[]
}

export interface Metadata {
  [key: string]: any
}
