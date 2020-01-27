import { SensorPayload } from '../emitter'

type PayloadMapper<T> = (input: SensorPayload) => T

export { PayloadMapper }
