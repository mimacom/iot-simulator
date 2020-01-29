import * as mc from '@mindconnect/mindconnect-nodejs'
import { PayloadMapper, SensorPayload } from '@iot-simulator/api'

interface Configuration {
  transform?: PayloadMapper<SensorPayload>
  agentConfig: mc.IMindConnectConfiguration
  retryCount?: number
  batchSize?: number
}

export { Configuration }
