import 'reflect-metadata'

import { Container } from 'inversify'
import { buildProviderModule } from 'inversify-binding-decorators'
import { builderOf } from 'iot-simulator-shared'

import 'iot-simulator-faker-generator-plugin'
import 'iot-simulator-stdout-output-plugin'

import { Simulation, Device, Sensor, parseConfig } from '../src/iot-simulator-core'

describe('Dummy test', () => {
  const container = new Container()
  container.load(buildProviderModule())

  it('works if true is truthy', () => {
    const simulationConfig = builderOf<Simulation>()
      .title('Mining Company')
      .description('Simulation of a mining company which has iot connected trucks')
      .devices([
        builderOf<Device>()
          .id(parseConfig('init:faker:{{random.uuid}}'))
          .instances(3)
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
          .build()
      ])
      .generatorPlugins([
        {
          id: 'faker'
        },
        {
          id: 'navigator',
          provider: (config: any) => config,
          config: {
            start: 'Stuttgart',
            end: 'Frankfurt',
            targetSpeed: 80,
            variance: 0.02
          }
        }
      ])
      .outputPlugins([
        {
          id: 'stdout'
        }
      ])
      .build()

    console.log(JSON.stringify(simulationConfig, null, 2))
  })
})
