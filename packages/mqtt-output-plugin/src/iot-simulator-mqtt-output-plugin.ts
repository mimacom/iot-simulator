import { OutputPlugin, OUTPUT_TYPE, provideNamed, Payload, Sensor } from 'iot-simulator-shared'
import { connect, Client } from 'mqtt'
import uuid from 'uuid/v4'
@provideNamed(OUTPUT_TYPE, 'mqtt-output')
export default class MQTTOutputPlugin implements OutputPlugin {
  mqttClient: Client
  defaultTopic = 's/us'

  mqttClientID: string
  mqttRSSITemplate: string = '210'
  mqttTemperatureTemplate: string = '211'
  mqttBatteryTemplate: string = '212'
  mqttCustomTemplate: string = '200'

  constructor(
    private mqttClientName: string,
    mqttClientID: string,
    private mqttHost: string,
    private tenant: string,
    private username: string,
    private password: string
  ) {
    if (!mqttClientID) {
      mqttClientID = uuid()
    }
    this.mqttClientID = mqttClientID
    this.mqttClient = connect(this.mqttHost, {
      username: this.tenant + '/' + this.username,
      password: this.password,
      clientId: this.mqttClientID
    })
  }
  send(payload: Payload) {
    payload.devices.forEach(d => {
      d.sensors.forEach(s => {
        switch (s.id) {
          case 'temperature': {
            this.mqttClient.publish(this.defaultTopic, `${this.mqttTemperatureTemplate},${s.value}`)
            break
          }
          case 'rssi': {
            this.mqttClient.publish(this.defaultTopic, `${this.mqttRSSITemplate},${s.value}`)
            break
          }
          case 'battery': {
            this.mqttClient.publish(this.defaultTopic, `${this.mqttBatteryTemplate},${s.value}`)
            break
          }
          default: {
            this.sendCustomMeasurement(s.id, s.id, s.value, s.id)
            break
          }
        }
      })
    })
  }
  subscibteToOprations() {
    return this.mqttClient.subscribe('s/ds')
  }
  createDevice() {
    this.mqttClient.publish(this.defaultTopic, `100,${this.mqttClientName},iot-data-simulator`)
  }
  setDeviceInformation(serialNumber: string, hardwareModel: string, revision: string) {
    this.mqttClient.publish(this.defaultTopic, `110,${serialNumber},${hardwareModel},${revision}`)
  }
  sendCustomMeasurement(
    measurementName: string,
    measurementValueName: string,
    value: string,
    symbol: string
  ) {
    this.mqttClient.publish(
      this.defaultTopic,
      `${this.mqttCustomTemplate},${measurementName},${measurementValueName},${value},${symbol}`
    )
  }
}
