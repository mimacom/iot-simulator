import { Device } from './device'
import { OutputPlugin } from '../plugin';

export interface Simulation {
  title: string
  description?: string
  randomSeed?: string
  startTime?: string
  endTime?: string
  devices: Device[]
  outputPlugins: OutputPlugin[]
}
