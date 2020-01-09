import 'reflect-metadata'

import { builderOf } from '@thecodeaware/ts-interface-builder'
import { Container } from 'inversify'
import { buildProviderModule } from 'inversify-binding-decorators'
import { STATELESS_TYPE } from 'iot-simulator-shared'
import 'iot-simulator-faker-generator-plugin'
import 'iot-simulator-navigator-generator-plugin'
import 'iot-simulator-mindsphere-output-plugin'

import { Simulation } from '../src/descriptor/simulation'
import { Device } from '../src/descriptor/device'
import { Sensor } from '../src/descriptor/sensor'
import { parseConfig } from '../src/descriptor/generation-config'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  const container = new Container()
  container.load(buildProviderModule())

  it('works if true is truthy', () => {
    const test = container.getNamed<any>(STATELESS_TYPE, 'faker').generate('{{name.findName}}')
    console.log(test)

    const simulationConfig =
      builderOf<Simulation>()
        .title('Mining Company')
        .description('Simulation of a mining company which has iot connected trucks')
        .devices([
          builderOf<Device>()
            .id(parseConfig('init:faker:{{random.uuid}}'))
            .instances(1)
            .metadata({
              type: 'truck',
              driver: parseConfig('init:faker:{{name.findName}}')
            })
            .sensors([
              builderOf<Sensor>()
                .id(parseConfig('init:faker:{{random.uuid}}'))
                .unit('C')
                .label('Temperature')
                .samplingRate(10000)
                .value(parseConfig('tick:faker:{{random.number({"min": 300, "max": 330})}}'))
                .build()
            ])
            .build() || ({} as any)
        ])
        .build() || {}

    console.log(JSON.stringify(simulationConfig, null, 2))
  })
})
