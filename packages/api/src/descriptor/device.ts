import { Sensor } from './sensor'
import { Metadata } from './metadata'

export interface Device {
  id: string
  name: string
  metadata?: Metadata
  sensors?: Sensor[]
  devices?: Device[]
}
