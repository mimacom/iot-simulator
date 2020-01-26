import moment from 'moment'
import { Device, Simulation } from 'iot-simulator-api'
import { SensorEmitter } from '../emitter/sensor-emitter'
import { TimeFrame } from './time-frame'
import { merge, Observable } from 'rxjs'
import { PluginExecutor } from './plugin-executor'

class SimulationRunner {
  private simulation: Simulation
  private timeFrame: TimeFrame
  private pluginExecutor: PluginExecutor
  private sensorEmitters: SensorEmitter[]
  private outputEmitter: Observable<any>

  constructor() {}

  public load(simulation: Simulation): void {
    this.pluginExecutor = new PluginExecutor()
    this.simulation = simulation
    this.timeFrame = {
      startTime: moment(this.simulation.startTime).valueOf(),
      endTime: moment(this.simulation.endTime).valueOf()
    }
    this.sensorEmitters = this.generateEmitters(simulation.devices)
    // map the SensorEmitters to their observables and merge them
    this.outputEmitter = merge(...this.sensorEmitters.map(e => e.getEmitter()))
  }

  public async run(): Promise<any> {
    return new Promise((resolve, _) => {
      this.outputEmitter.subscribe(console.log, console.error, () => resolve())
    })
  }

  private generateEmitters = (devices: Device[]): SensorEmitter[] => {
    return (
      devices
        // map every device to an array of sensor emitters (recursively)
        .map(device => {
          let emitters: SensorEmitter[] = []
          // if there are sensors produce an array of emitters
          if (device.sensors && device.sensors.length > 0) {
            const localEmitters = device.sensors.map(
              sensor => new SensorEmitter(this.pluginExecutor, sensor, this.timeFrame)
            )
            emitters = emitters.concat(localEmitters)
          }
          // if there are devices recurse and concat the result
          if (device.devices && device.devices.length > 1) {
            emitters = emitters.concat(this.generateEmitters(device.devices))
          }
          return emitters
        })
        // flatMap all intermediate arrays into a single array
        .reduce((prev, curr) => prev.concat(curr), [])
    )
  }
}

export { SimulationRunner }
