import MQTTOutputPlugin from '../src/iot-simulator-mqtt-output-plugin'

/**
 * Dummy test
 */
const mqttClientName: string = 'iot-data-simulator'
const mqttClientID: string = 'iot-data-simuluator'
const mqttHost: string = 'mciotextension.eu1.mindsphere.io'
const tenant: string = 'mimacom'
const username: string = 'joachim.spalink@mimacom.com'
const password: string = '4H?P=&,u|UdK$TcU@xI7'

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
    expect(mqttOut).toBeInstanceOf(MQTTOutputPlugin)
    mqttOut.createDevice()
    mqttOut.createCustomMeasurement('fuelconsumption', 'Liters', '10', 'L')
  })
})
