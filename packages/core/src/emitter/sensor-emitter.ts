import moment from 'moment'
import { generate, interval, concat, Observable, asyncScheduler } from 'rxjs'
import { Sensor, SensorPayload } from 'iot-simulator-api'
import { map, takeWhile, tap } from 'rxjs/operators'
import { TimeFrame } from '../runner/time-frame'

class SensorEmitter {
  private emitter: Observable<any>

  constructor(private devicePath: string, private sensor: Partial<Sensor>, timeFrame: TimeFrame) {
    const historic = generate(
      // teake start time or now if undefined
      this.generatePayload(timeFrame.startTime || moment().valueOf()),
      // while the generated timestamp is lower than now
      event => event.timestamp < moment().valueOf(),
      // generate a new while shifted by the sampling rate
      event => {
        return this.generatePayload(event.timestamp + this.sensor.samplingRate)
      },
      // enable async scheduler to avoid generating everything in the same loop
      // This will allow us to have mixed sensors instead of fort sensor1, then sensor2, etc.
      asyncScheduler
    )

    // generate every 'samplingRate' milliseconds
    const live = interval(sensor.samplingRate).pipe(
      // when triggered take current time
      map(_ => this.generatePayload(moment().valueOf())),
      // untill current time under endTime or forever if end time is not defined
      takeWhile(event => !timeFrame.endTime || event.timestamp < timeFrame.endTime)
    )

    this.emitter = concat(historic, live)
  }

  getEmitter() {
    return this.emitter
  }

  private generatePayload(timestamp: number): SensorPayload {
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
