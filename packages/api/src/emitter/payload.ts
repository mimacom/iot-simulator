import { Metadata } from '../descriptor/metadata'

interface SensorPayload {
  devicePath: string
  sensorId: string
  name: string
  metadata: Metadata
  timestamp: number
  value: any
}

export { SensorPayload }
