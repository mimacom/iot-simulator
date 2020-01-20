import { Device } from './device'

export interface Simulation {
  title: string
  description: string
  randomSeed: string
  startTime?: string
  endTime?: string
  devices: Device[]
  generatorPlugins: any[]
  outputPlugins: any[]
}
