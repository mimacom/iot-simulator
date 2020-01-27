import 'reflect-metadata'

import { Simulation, Device, Sensor } from 'iot-simulator-api'
import { builderOf, parseConfig as p } from 'iot-simulator-shared'

import 'iot-simulator-faker-generator-plugin'

import { SimulationRunner } from '../src/runner/simulation-runner'
import moment = require('moment')
import { PluginExecutor } from '../src/runner/plugin-executor'
import { StdoutOutputPlugin } from 'iot-simulator-stdout-output-plugin'
import { NavigatorGeneratorPlugin } from '../../navigator-generator-plugin/src/plugin'

describe('Dummy test', () => {
  const pluginExecutor = new PluginExecutor()

  it('works if true is truthy', async done => {
    const navigator = new NavigatorGeneratorPlugin('Stuttgart ', 'Frankfurt', 70)
    await navigator.init()
    const navUuid = pluginExecutor.newInstance('navigator', navigator)
    const simulationConfig = builderOf<Simulation>()
      .title('Mining Company')
      .startTime(
        moment()
          .subtract(10, 'seconds')
          .format()
      )
      .endTime(
        moment()
          .add(0, 'second')
          .format()
      )
      .description('Simulation of a mining company which has iot connected trucks')
      .devices(
        [1, 2]
          .map(_ => {
            return builderOf<Device>()
              .id(pluginExecutor.generate('faker', null, '{{random.uuid}}'))
              .name('truck')
              .metadata({
                driver: pluginExecutor.generate('faker', null, '{{name.findName}}')
              })
              .sensors([
                builderOf<Sensor>()
                  .id(pluginExecutor.generate('faker', null, '{{random.uuid}}'))
                  .name('temperature')
                  .metadata({
                    unit: '°C',
                    label: 'External Temperature'
                  })
                  .samplingRate(1000)
                  .valueGenerator(() =>
                    pluginExecutor.generate(
                      'faker',
                      null,
                      '{{random.number({"min": 80, "max": 100})}}'
                    )
                  )
                  .build(),
                builderOf<Sensor>()
                  .id(pluginExecutor.generate('faker', null, '{{random.uuid}}'))
                  .name('location')
                  .metadata({
                    unit: 'Geo',
                    label: 'GPS Location'
                  })
                  .samplingRate(60000)
                  .valueGenerator((timestamp: number) =>
                    pluginExecutor.generate('navigator', navUuid, timestamp)
                  )
                  .build()
              ])
              .devices([
                builderOf<Device>()
                  .id(pluginExecutor.generate('faker', null, '{{random.uuid}}'))
                  .name('engine')
                  .sensors([
                    builderOf<Sensor>()
                      .id(pluginExecutor.generate('faker', null, '{{random.uuid}}'))
                      .name('temperature')
                      .metadata({
                        unit: 'C',
                        label: 'Engine Temperature'
                      })
                      .samplingRate(5000)
                      .valueGenerator(() =>
                        pluginExecutor.generate(
                          'faker',
                          null,
                          '{{random.number({"min": 80, "max": 100})}}'
                        )
                      )
                      .build()
                  ])
                  .build()
              ])
              .build()
          })
          .reduce((prev, curr) => prev.concat([curr]), [])
      )
      .outputPlugins([new StdoutOutputPlugin()])
      .build()

    const sr = new SimulationRunner()
    sr.load(simulationConfig)
    await sr.run()
    done()
  })
})
