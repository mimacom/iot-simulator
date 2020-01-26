import { Sensor } from './sensor'
import { GeneratorConfig } from './generator-config'
import { Metadata } from './metadata'

export interface Device {
  id: string | GeneratorConfig
  name: string | GeneratorConfig
  metadata: Metadata
  instances: number | GeneratorConfig
  sensors?: Sensor[]
  devices?: Device[]
}
