import { OutputPlugin } from 'iot-simulator-api'
import { connect, Client } from 'mqtt'
import uuid from 'uuid/v4'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * MQTT output plugin, templates compatible with mindsphere and cumulocity
 */
export default class MQTTOutputPlugin implements OutputPlugin {
  mqttClient: Client
  defaultTopic = 's/us'

  mqttClientID: string
  mqttRSSITemplate: string = '210'
  mqttTemperatureTemplate: string = '211'
  mqttBatteryTemplate: string = '212'
  mqttCustomTemplate: string = '200'
  private mapper: Function

  constructor(
    private mqttClientName: string,
    mqttClientID: string,
    private mqttHost: string,
    private tenant: string,
    private username: string,
    private password: string
  ) {
    this.mapper = (i: any) => i
    if (!mqttClientID) {
      mqttClientID = uuid()
    }
    this.mqttClientID = mqttClientID
    this.mqttClient = connect(this.mqttHost, {
      username: this.tenant + '/' + this.username,
      password: this.password,
      clientId: this.mqttClientID
    })
    this.createDevice()
  }

  registerSource(source: Observable<any>): void {
    source
      .pipe(map((data: any) => this.mapper(data)))
      .subscribe((payload: any) => this.send(payload))
  }

  setTransformFunction(mapper: Function): void {
    this.mapper = mapper
  }

  /**
   * sends payload. Uses template 210 when sensor.id === rssi for RSSI,
   * 211 when sensor.id === temperature for Temperature and
   * 212 when sensor.id === battery for Battery.
   * Every other uses template 200 for Custom Measurement
   * @param payload
   */
  send(payload: any) {
    payload.devices.forEach((d: any) => {
      d.sensors.forEach((s: any) => {
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
  /**
   * creates device using template 100
   */
  createDevice() {
    this.mqttClient.publish(this.defaultTopic, `100,${this.mqttClientName},iot_data_simulator`)
  }
  /**
   * Set device information with template 110
   * @param serialNumber
   * @param hardwareModel
   * @param revision
   */
  setDeviceInformation(serialNumber: string, hardwareModel: string, revision: string) {
    this.mqttClient.publish(this.defaultTopic, `110,${serialNumber},${hardwareModel},${revision}`)
  }
  /**
   * Send custom measurement using template 200
   * @param measurementName
   * @param label
   * @param value
   * @param unit
   */
  sendCustomMeasurement(measurementName: string, label: string, value: string, unit: string) {
    this.mqttClient.publish(
      this.defaultTopic,
      `${this.mqttCustomTemplate},${measurementName},${label},${value},${unit}`
    )
  }
}
export { MQTTOutputPlugin }
