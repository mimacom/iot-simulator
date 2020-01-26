import { GeneratorConfig } from './generator-config'
import { Metadata } from './metadata'

export interface Sensor {
  id: string | GeneratorConfig
  name: string | GeneratorConfig
  metadata?: Metadata
  samplingRate: number
  valueGenerator: Function
}
