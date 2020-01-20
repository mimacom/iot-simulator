import { provideNamed } from 'iot-simulator-shared'
import { OutputPlugin, OUTPUT_PLUGIN_TYPE } from 'iot-simulator-api'

@provideNamed(OUTPUT_PLUGIN_TYPE, 'stdout')
export default class IotSimulatorMindsphereOutputPlugin implements OutputPlugin {
  public send(payload: any): void {
    console.log(payload)
  }
}
