import 'reflect-metadata'

import { Simulation, Device, Sensor } from 'iot-simulator-api'
import { builderOf, parseConfig as p } from 'iot-simulator-shared'

import 'iot-simulator-faker-generator-plugin'
import 'iot-simulator-stdout-output-plugin'

import { SimulationRunner } from '../src/runner/simulation-runner'
import moment = require('moment')
import { PluginExecutor } from '../src/runner/plugin-executor'
import CounterGeneratorPlugin from '../src/counter-generator-plugin'
import { StdoutOutputPlugin } from 'iot-simulator-stdout-output-plugin'

describe('Dummy test', () => {
  const pluginExecutor = new PluginExecutor()

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
          .add(10, 'second')
          .format()
      )
      .description('Simulation of a mining company which has iot connected trucks')
      .devices(
        [1, 2]
          .map(idx => {
            const uuid = pluginExecutor.newInstance('counter', new CounterGeneratorPlugin())
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
                  .samplingRate(5000)
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
                  .name('pressure')
                  .metadata({
                    unit: 'bar',
                    label: 'Pressure'
                  })
                  .samplingRate(10000)
                  .valueGenerator(() => pluginExecutor.generate('counter', uuid, ''))
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
