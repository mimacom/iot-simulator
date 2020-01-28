import { OutputPlugin, PayloadMapper, SensorPayload } from 'iot-simulator-api'
import { Observable, from } from 'rxjs'
import { flatMap, map, bufferCount, delayWhen } from 'rxjs/operators'
import { Configuration } from './config'
import mc, {
  MindConnectAgent as IMindConnectAgent,
  Mapping,
  DataPointValue
} from '@mindconnect/mindconnect-nodejs'
const { retry, MindConnectAgent } = mc

const DEFAULT_RETRY_TIMES = 3
const DEFAULT_BATCH_SIZE = 5

class MindsphereOutputPlugin implements OutputPlugin {
  private agent: IMindConnectAgent
  private mapper: PayloadMapper<any>
  private retryCount: number
  private batchSize: number
  private dataMappings: Mapping[] = []

  constructor(config: Configuration) {
    this.agent = new MindConnectAgent(config.agentConfig)
    this.mapper = config.transform || (input => input)
    this.retryCount = config.retryCount || DEFAULT_RETRY_TIMES
    this.batchSize = config.batchSize || DEFAULT_BATCH_SIZE
  }

  registerSource(source: Observable<SensorPayload>): void {
    // init and register the
    source
      .pipe(
        delayWhen(() => from(this.init())),
        map((payload: SensorPayload) => this.mapper(payload)),
        bufferCount(this.batchSize),
        flatMap((batch: SensorPayload[]) => this.toDataBatch(batch))
      )
      .subscribe((normalizedPayload: DataPointValue[]) => this.send(normalizedPayload))
  }

  private async toDataBatch(batch: SensorPayload[]) {
    // fetch dataMappings
    const dataBatch: DataPointValue[] = []
    // for every payload find the correspondent mapping
    for (let sensorPayload of batch) {
      const mapping = this.dataMappings.find(mapping => {
        return mapping.propertyName === sensorPayload.name
      })
      // if it exist add to results
      if (mapping) {
        dataBatch.push({
          dataPointId: mapping.dataPointId,
          qualityCode: '0',
          value: sensorPayload.value
        })
        // otherwise drop and log
      } else {
        console.log(`Dropping payload '${sensorPayload.name}', no mapping found`)
      }
    }
    return dataBatch
  }

  private async send(dataBatch: DataPointValue[]) {
    await retry(this.retryCount, () => this.agent.PostData(dataBatch))
  }

  private async init() {
    if (!this.agent.IsOnBoarded()) {
      await retry(this.retryCount, () => this.agent.OnBoard())
      console.log('Agent onboarded')
    }

    if (!this.agent.HasDataSourceConfiguration()) {
      await retry(this.retryCount, () => this.agent.GetDataSourceConfiguration())
      console.log('Data Source Configuration acquired')
    }

    await retry(
      this.retryCount,
      async () => (this.dataMappings = await this.agent.GetDataMappings())
    )
  }
}

export { MindsphereOutputPlugin }
