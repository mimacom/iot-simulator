import moment from 'moment'
import { merge, Observable, Subject } from 'rxjs'
import { Device, Simulation, OutputPlugin } from '@iot-simulator/api'

import { SensorEmitter } from '../emitter/sensor-emitter'
import { TimeFrame } from './time-frame'

class SimulationRunner {
  private simulation: Simulation
  private timeFrame: TimeFrame
  private sensorEmitters: SensorEmitter[]
  private outputEmitter: Observable<any>
  private broadcaster: Subject<any>

  public load(simulation: Simulation): void {
    this.simulation = simulation
    this.timeFrame = {
      startTime: moment(this.simulation.startTime).valueOf(),
      endTime: moment(this.simulation.endTime).valueOf()
    }
    this.sensorEmitters = this.generateEmitters('', simulation.devices)
    // map the SensorEmitters to their observables and merge them
    this.outputEmitter = merge(...this.sensorEmitters.map(e => e.getEmitter()))
    // use a subject so multiple plugins can subscribe before the generation starts
    this.broadcaster = new Subject()
    // register the broadcaster as source to all output plugins
    this.simulation.outputPlugins.forEach((plugin: OutputPlugin) =>
      plugin.registerSource(this.broadcaster)
    )
  }

  public async run(): Promise<any> {
    return new Promise((resolve, _) => {
      // when run is called subscribe to the emitter and start pushing events
      this.outputEmitter.subscribe(
        event => this.broadcaster.next(event),
        console.error,
        // resolve the promise when the generation completes
        () => {
          this.broadcaster.complete()
          resolve()
        }
      )
    })
  }

  private generateEmitters = (parentPath: string, devices: Device[]): SensorEmitter[] => {
    return (
      devices
        // map every device to an array of sensor emitters (recursively)
        .map(device => {
          let emitters: SensorEmitter[] = []
          const devicePath = `${parentPath}/${device.name}_${device.id}`
          // if there are sensors produce an array of emitters
          if (device.sensors && device.sensors.length > 0) {
            const localEmitters = device.sensors.map(
              sensor => new SensorEmitter(devicePath, sensor, this.timeFrame)
            )
            emitters = emitters.concat(localEmitters)
          }
          // if there are devices recurse and concat the result
          if (device.devices && device.devices.length > 0) {
            emitters = emitters.concat(this.generateEmitters(devicePath, device.devices))
          }
          return emitters
        })
        // flatMap all intermediate arrays into a single array
        .reduce((prev, curr) => prev.concat(curr), [])
    )
  }
}

export { SimulationRunner }
