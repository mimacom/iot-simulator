import moment from 'moment'
import { generate, interval, concat, Observable } from 'rxjs'
import { Sensor } from 'iot-simulator-api'
import { map, takeWhile } from 'rxjs/operators'
import { TimeFrame } from '../runner/time-frame'

class SensorEmitter {
  private emitter: Observable<any>

  constructor(private devicePath: string, private sensor: Partial<Sensor>, timeFrame: TimeFrame) {
    const historic = generate(
      this.generatePayload(timeFrame.startTime),
      event => event.timestamp < moment().valueOf(),
      event => {
        return this.generatePayload(event.timestamp + this.sensor.samplingRate)
      }
    ).pipe(takeWhile(event => event.timestamp < moment().valueOf()))

    const live = interval(sensor.samplingRate).pipe(
      map(_ => this.generatePayload(moment().valueOf())),
      takeWhile(event => event.timestamp < timeFrame.endTime)
    )

    this.emitter = concat(historic, live)
  }

  getEmitter() {
    return this.emitter
  }

  private generatePayload(timestamp: number) {
    return {
      devicePath: this.devicePath,
      sensorId: this.sensor.id,
      name: this.sensor.name,
      metadata: this.sensor.metadata,
      timestamp,
      value: this.sensor.valueGenerator(timestamp)
    }
  }
}

export { SensorEmitter }
