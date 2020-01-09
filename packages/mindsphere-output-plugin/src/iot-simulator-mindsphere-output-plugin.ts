import {
  DataPointValue,
  IMindConnectConfiguration,
  MindConnectAgent,
  retry,
  Mapping
} from "@mindconnect/mindconnect-nodejs";
import { Device, OutputPlugin, OUTPUT_TYPE, provideNamed, Payload, Sensor } from 'iot-simulator-shared'

const log = (text: any) => {
  console.log(`[${new Date().toISOString()}] ${text.toString()}`);
};

@provideNamed(OUTPUT_TYPE, 'mindsphere')
export default class IotSimulatorMindsphereOutputPlugin implements OutputPlugin {

  private readonly mindConnectAgent: MindConnectAgent;
  private static readonly RETRYTIMES: number = 5;

  constructor(mindConnectConfiguration: IMindConnectConfiguration) {
    this.mindConnectAgent = new MindConnectAgent(mindConnectConfiguration);
  }

  public async send(payload: Payload) {
    log('Sending payload ...');
    await this.ensureOnBoarding();

    let dataMappingsFromMindSphere: Mapping[] = [];
    await retry(IotSimulatorMindsphereOutputPlugin.RETRYTIMES, async () =>
      dataMappingsFromMindSphere = await this.mindConnectAgent.GetDataMappings()
    );

    const testData: DataPointValue[] = await this.transformPayloadToMindsphere(payload, dataMappingsFromMindSphere);
    await retry(IotSimulatorMindsphereOutputPlugin.RETRYTIMES, () => this.mindConnectAgent.PostData(testData));
    log('Data has been posted!');
  }


  private async transformPayloadToMindsphere(payload: Payload, dataMappingsFromMindSphere: Mapping[]) {
    let result: DataPointValue[] = [];
    payload.devices.forEach((device: Device) => {
      device.sensors.forEach((sensor: Sensor) => {
        dataMappingsFromMindSphere.forEach((dataMappingMindsphere: Mapping) => {
          if (sensor.id && dataMappingMindsphere.propertyName && sensor.id.toUpperCase() === dataMappingMindsphere.propertyName.toUpperCase()) {
            result.push({
              dataPointId: dataMappingMindsphere.dataPointId,
              qualityCode: '0',
              value: sensor.value
            });
          }
        })
      })
    });

    return result;
  }

  private async ensureOnBoarding() {
    if (!this.mindConnectAgent.IsOnBoarded()) {
      await retry(IotSimulatorMindsphereOutputPlugin.RETRYTIMES, () => this.mindConnectAgent.OnBoard());
    }

    if (!this.mindConnectAgent.HasDataSourceConfiguration()) {
      await retry(IotSimulatorMindsphereOutputPlugin.RETRYTIMES, () => this.mindConnectAgent.GetDataSourceConfiguration());
      log('Data Source Configuration acquired!');
    }
  }
}
