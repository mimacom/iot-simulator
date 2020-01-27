import { provideNamed } from 'iot-simulator-shared'
import { OutputPlugin } from 'iot-simulator-api'
import * as mindconnectNodejs from '@mindconnect/mindconnect-nodejs'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
const log = (text: any) => {
  console.log(`[${new Date().toISOString()}] ${text.toString()}`)
}

export class IotSimulatorMindsphereOutputPlugin implements OutputPlugin {
  private readonly mindConnectAgent: mindconnectNodejs.MindConnectAgent
  private static readonly RETRYTIMES: number = 5
  private mapper: any
  constructor(mindConnectConfiguration: mindconnectNodejs.IMindConnectConfiguration) {
    this.mindConnectAgent = new mindconnectNodejs.MindConnectAgent(mindConnectConfiguration)
  }

  registerSource(source: Observable<any>): void {
    source
      .pipe(map((data: any) => this.mapper(data)))
      .subscribe((payload: any) => this.send(payload))
  }

  setTransformFunction(mapper: Function): void {
    this.mapper = mapper
  }
  public async send(payload: any) {
    log('Sending payload ...')
    await this.ensureOnBoarding()

    let dataMappingsFromMindSphere: mindconnectNodejs.Mapping[] = []
    await mindconnectNodejs.retry(
      IotSimulatorMindsphereOutputPlugin.RETRYTIMES,
      async () => (dataMappingsFromMindSphere = await this.mindConnectAgent.GetDataMappings())
    )

    const testData: mindconnectNodejs.DataPointValue[] = await this.transformPayloadToMindsphere(
      payload,
      dataMappingsFromMindSphere
    )
    await mindconnectNodejs.retry(IotSimulatorMindsphereOutputPlugin.RETRYTIMES, () =>
      this.mindConnectAgent.PostData(testData)
    )
    log('Data has been posted!')
  }

  private async transformPayloadToMindsphere(
    payload: any,
    dataMappingsFromMindSphere: mindconnectNodejs.Mapping[]
  ) {
    let result: mindconnectNodejs.DataPointValue[] = []
    payload.devices.forEach((device: any) => {
      device.sensors.forEach((sensor: any) => {
        dataMappingsFromMindSphere.forEach((dataMappingMindsphere: mindconnectNodejs.Mapping) => {
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
      await mindconnectNodejs.retry(IotSimulatorMindsphereOutputPlugin.RETRYTIMES, () =>
        this.mindConnectAgent.OnBoard()
      )
    }

    if (!this.mindConnectAgent.HasDataSourceConfiguration()) {
      await mindconnectNodejs.retry(IotSimulatorMindsphereOutputPlugin.RETRYTIMES, () =>
        this.mindConnectAgent.GetDataSourceConfiguration()
      )
      log('Data Source Configuration acquired!')
    }
  }
}

export default IotSimulatorMindsphereOutputPlugin
