import "reflect-metadata";
const moment = require("moment");

import { Simulation, Device, Sensor } from "iot-simulator-api";
import { builderOf } from "iot-simulator-shared";
import { PluginExecutor, SimulationRunner } from "iot-simulator-core";

import "iot-simulator-faker-generator-plugin";
import { NavigatorGeneratorPlugin } from "iot-simulator-navigator-generator-plugin";

import { StdoutOutputPlugin } from "iot-simulator-stdout-output-plugin";
import { MindsphereOutputPlugin } from "iot-simulator-mindsphere-output-plugin";

(async () => {
  const pluginExecutor = new PluginExecutor();

  const navigator = new NavigatorGeneratorPlugin("Stuttgart ", "Frankfurt", 70);
  await navigator.init();
  const navUuid = pluginExecutor.newInstance("navigator", navigator);
  const simulationConfig = builderOf<Simulation>()
    .title("Mining Company")
    .startTime(
      moment()
        .subtract(0, "seconds")
        .format()
    )
    .endTime(
      moment()
        .add(10, "second")
        .format()
    )
    .description(
      "Simulation of a mining company which has iot connected trucks"
    )
    .devices(
      [1, 2]
        .map(_ => {
          return builderOf<Device>()
            .id(pluginExecutor.generate("faker", null, "{{random.uuid}}"))
            .name("truck")
            .metadata({
              driver: pluginExecutor.generate(
                "faker",
                null,
                "{{name.findName}}"
              )
            })
            .sensors([
              builderOf<Sensor>()
                .id(pluginExecutor.generate("faker", null, "{{random.uuid}}"))
                .name("Temperature")
                .metadata({
                  unit: "°C",
                  label: "External Temperature"
                })
                .samplingRate(1000)
                .valueGenerator(() =>
                  pluginExecutor.generate(
                    "faker",
                    null,
                    '{{random.number({"min": 80, "max": 100})}}'
                  )
                )
                .build(),
              builderOf<Sensor>()
                .id(pluginExecutor.generate("faker", null, "{{random.uuid}}"))
                .name("location")
                .metadata({
                  unit: "Geo",
                  label: "GPS Location"
                })
                .samplingRate(60000)
                .valueGenerator((timestamp: number) =>
                  pluginExecutor.generate("navigator", navUuid, timestamp)
                )
                .build()
            ])
            .devices([
              builderOf<Device>()
                .id(pluginExecutor.generate("faker", null, "{{random.uuid}}"))
                .name("engine")
                .sensors([
                  builderOf<Sensor>()
                    .id(
                      pluginExecutor.generate("faker", null, "{{random.uuid}}")
                    )
                    .name("EngineTemperature")
                    .metadata({
                      unit: "C",
                      label: "Engine Temperature"
                    })
                    .samplingRate(5000)
                    .valueGenerator(() =>
                      pluginExecutor.generate(
                        "faker",
                        null,
                        '{{random.number({"min": 80, "max": 100})}}'
                      )
                    )
                    .build()
                ])
                .build()
            ])
            .build();
        })
        .reduce((prev, curr) => prev.concat([curr]), [])
    )
    .outputPlugins([
      new StdoutOutputPlugin(),
      new MindsphereOutputPlugin({
        agentConfig: require("../../mindsphere-output-plugin/src/agentconfig.json")
      })
    ])
    .build();

  const sr = new SimulationRunner();
  sr.load(simulationConfig);
  await sr.run();
})();
