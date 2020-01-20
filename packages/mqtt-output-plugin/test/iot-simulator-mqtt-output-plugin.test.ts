import 'reflect-metadata'
import MQTTOutputPlugin from '../src/iot-simulator-mqtt-output-plugin'

/**
 * Dummy test
 */
const mqttClientName: string = 'iot-data-simulator'
const mqttClientID: string = 'iot-data-simulator'
const mqttHost: string = 'tcp://mciotextension.eu1.mindsphere.io'
const tenant: string = 'mimacom'
const username: string = process.env.MINDSPHERE_USERNAME
const password: string = process.env.MINDSPHERE_PASSWORD

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
    console.log('client id is: ' + mqttOut.mqttClientID)
    mqttOut.createDevice()
    mqttOut.createCustomMeasurement('fuelconsumption', 'Liters', '10', 'L')
    expect(mqttOut).toBeInstanceOf(MQTTOutputPlugin)
  })
})
