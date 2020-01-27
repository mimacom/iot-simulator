import { Observable } from 'rxjs'
import { SensorPayload } from '../emitter'

interface OutputPlugin {
  registerSource(source: Observable<SensorPayload>): void
}

export { OutputPlugin }
