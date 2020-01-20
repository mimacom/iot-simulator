import 'reflect-metadata'
import MQTTOutputPlugin from '../src/iot-simulator-mqtt-output-plugin'
import { Payload } from 'iot-simulator-shared'

const mqttClientName: string = 'iot-data-simulator'
const mqttClientID: string = 'iot-data-simulator'
const mqttHost: string = 'tcp://mciotextension.eu1.mindsphere.io'
const tenant: string = 'mimacom'
let username: string
let password: string
beforeAll(() => {
  username = process.env.MINDSPHERE_USERNAME!.toString()
  password = process.env.MINDSPHERE_PASSWORD!.toString()
})
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DummyClass is instantiable', () => {
    let mqttOut = new MQTTOutputPlugin(
      mqttClientName,
      mqttClientID,
      mqttHost,
      tenant,
      username,
      password
    )
    mqttOut.createDevice()
    const payload: Payload = {
      devices: [
        {
          sensors: [
            { id: 'temperature', value: '25' },
            { id: 'rssi', value: '-37' },
            { id: 'battery', value: '30' }
            // { id: 'fuelconsumption', value: '10', unit: 'L', label: 'Liters' }
          ]
        }
      ]
    }
    mqttOut.send(payload)
    mqttOut.sendCustomMeasurement('fuelconsumption', 'Liters', '10', 'L')
    expect(mqttOut).toBeInstanceOf(MQTTOutputPlugin)
  })
})
