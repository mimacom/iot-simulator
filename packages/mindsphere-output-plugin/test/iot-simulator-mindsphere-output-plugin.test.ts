import { MindsphereOutputPlugin } from '../src/iot-simulator-mindsphere-output-plugin'
import { IMindConnectConfiguration } from '@mindconnect/mindconnect-nodejs'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('IotSimulatorMindsphereOutputPlugin is instantiable', () => {
    const config: IMindConnectConfiguration = require('../src/agentconfig.json')
    expect(new MindsphereOutputPlugin({ agentConfig: config })).toBeInstanceOf(
      MindsphereOutputPlugin
    )
  })
})
