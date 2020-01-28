import { Metadata } from './metadata'

export interface Sensor {
  id: string
  name: string
  metadata?: Metadata
  samplingRate: number
  valueGenerator: (timestamp: number) => any
}
