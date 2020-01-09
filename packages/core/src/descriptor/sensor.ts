import { GenerationConfig } from './generation-config'

export interface Sensor {
  id: string | GenerationConfig
  label: string | GenerationConfig
  unit: string | GenerationConfig
  samplingRate: number
  value: GenerationConfig
}
