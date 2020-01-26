import 'reflect-metadata'

import { Container } from 'inversify'
import { buildProviderModule } from 'inversify-binding-decorators'
import { Simulation, Device, Sensor } from 'iot-simulator-api'
import { builderOf, parseConfig as p } from 'iot-simulator-shared'

import 'iot-simulator-faker-generator-plugin'
import 'iot-simulator-stdout-output-plugin'

import { SimulationRunner } from '../src/runner/simulation-runner'
import moment = require('moment')

describe('Dummy test', () => {
  const container = new Container()
  container.load(buildProviderModule())

  it('works if true is truthy', async done => {
    const simulationConfig = builderOf<Simulation>()
      .title('Mining Company')
      .startTime(
        moment()
          .subtract(0, 'seconds')
          .format()
      )
      .endTime(
        moment()
          .add(5, 'second')
          .format()
      )
      .description('Simulation of a mining company which has iot connected trucks')
      .devices(
        [1,2,3].map(idx => {
            return builderOf<Device>()
              .id(p('INIT:faker:{{random.uuid}}'))
              .name('truck')
              .metadata({
                driver: p('INIT:faker:{{name.findName}}')
              })
              .sensors([
                builderOf<Sensor>()
                  .id(p('INIT:faker:{{random.uuid}}'))
                  .name('temperature-' + idx)
                  .metadata({
                    unit: '°C',
                    label: 'Temperature'
                  })
                  .samplingRate(1000)
                  .valueGenerator(p('LIVE:faker:{{random.number({"min": 80, "max": 100})}}'))
                  .build(),
                builderOf<Sensor>()
                  .id(p('INIT:faker:{{random.uuid}}'))
                  .name('pressure-' + idx)
                  .metadata({
                    unit: 'bar',
                    label: 'Pressure'
                  })
                  .samplingRate(2000)
                  .valueGenerator(p('LIVE:faker:{{random.number({"min": 1, "max": 3})}}'))
                  .build()
              ])
              .build()
          }).reduce((prev, curr) => prev.concat([curr]), [])
      )
      .generatorPlugins([
        {
          id: 'faker'
        }
      ])
      .outputPlugins([
        {
          id: 'stdout'
        }
      ])
      .build()

    const sr = new SimulationRunner()
    sr.load(simulationConfig)
    await sr.run()
    done()
  })
})
