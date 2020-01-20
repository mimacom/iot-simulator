import { provideNamed } from 'iot-simulator-shared'
import { OutputPlugin, OUTPUT_PLUGIN_TYPE } from 'iot-simulator-api'
import {
  DataPointValue,
  IMindConnectConfiguration,
  retry,
  Mapping,
  MindConnectAgent
} from '@mindconnect/mindconnect-nodejs'

const log = (text: any) => {
  console.log(`[${new Date().toISOString()}] ${text.toString()}`)
}

@provideNamed(OUTPUT_PLUGIN_TYPE, 'mindsphere')
export class IotSimulatorMindsphereOutputPlugin implements OutputPlugin {
  private readonly mindConnectAgent: MindConnectAgent
  private static readonly RETRYTIMES: number = 5

  constructor(mindConnectConfiguration: IMindConnectConfiguration) {
    this.mindConnectAgent = new MindConnectAgent(mindConnectConfiguration)
  }

  public async send(payload: any) {
    log('Sending payload ...')
    await this.ensureOnBoarding()

    let dataMappingsFromMindSphere: Mapping[] = []
    await retry(
      IotSimulatorMindsphereOutputPlugin.RETRYTIMES,
      async () => (dataMappingsFromMindSphere = await this.mindConnectAgent.GetDataMappings())
    )

    const testData: DataPointValue[] = await this.transformPayloadToMindsphere(
      payload,
      dataMappingsFromMindSphere
    )
    await retry(IotSimulatorMindsphereOutputPlugin.RETRYTIMES, () =>
      this.mindConnectAgent.PostData(testData)
    )
    log('Data has been posted!')
  }

  private async transformPayloadToMindsphere(
    payload: any,
    dataMappingsFromMindSphere: Mapping[]
  ) {
    let result: DataPointValue[] = []
    payload.devices.forEach((device: any) => {
      device.sensors.forEach((sensor: any) => {
        dataMappingsFromMindSphere.forEach((dataMappingMindsphere: Mapping) => {
          if (
            sensor.id &&
            dataMappingMindsphere.propertyName &&
            sensor.id.toUpperCase() === dataMappingMindsphere.propertyName.toUpperCase()
          ) {
            result.push({
              dataPointId: dataMappingMindsphere.dataPointId,
              qualityCode: '0',
              value: sensor.value
            })
          }
        })
      })
    })

    return result
  }

  private async ensureOnBoarding() {
    if (!this.mindConnectAgent.IsOnBoarded()) {
      await retry(IotSimulatorMindsphereOutputPlugin.RETRYTIMES, () =>
        this.mindConnectAgent.OnBoard()
      )
    }

    if (!this.mindConnectAgent.HasDataSourceConfiguration()) {
      await retry(IotSimulatorMindsphereOutputPlugin.RETRYTIMES, () =>
        this.mindConnectAgent.GetDataSourceConfiguration()
      )
      log('Data Source Configuration acquired!')
    }
  }
}

export default IotSimulatorMindsphereOutputPlugin
