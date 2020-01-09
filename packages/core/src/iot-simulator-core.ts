import 'reflect-metadata'

import { builderOf } from './builder/proxy-interface-builder'
import { Container } from 'inversify'
import { buildProviderModule } from 'inversify-binding-decorators'
import { STATELESS_TYPE } from 'iot-simulator-shared'
import 'iot-simulator-faker-generator-plugin'

import { Simulation } from './descriptor/simulation'
import { Device } from './descriptor/device'
import { Sensor } from './descriptor/sensor'
import { parseConfig } from './descriptor/generation-config'

/**
 * Dummy test
 */
const container = new Container()
container.load(buildProviderModule())

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
