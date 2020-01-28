import "reflect-metadata";
import * as moment from "moment";
import * as fs from "fs";

import { Simulation } from "iot-simulator-api";
import { PluginExecutor, SimulationRunner } from "iot-simulator-core";

import "iot-simulator-faker-generator-plugin";
import { NavigatorGeneratorPlugin } from "iot-simulator-navigator-generator-plugin";

import { StdoutOutputPlugin } from "iot-simulator-stdout-output-plugin";
import { MindsphereOutputPlugin } from "iot-simulator-mindsphere-output-plugin";

(async () => {
  const agentConfigFile: string = fs.readFileSync(
    "/home/ntrp/_ws/mimacom/repos/iot-simulator/packages/mindsphere-output-plugin/src/agentconfig.json",
    { encoding: "UTF-8" }
  );
  const agentConfig = JSON.parse(agentConfigFile);

  const pluginExecutor = new PluginExecutor();

  const navigator = new NavigatorGeneratorPlugin("Stuttgart ", "Frankfurt", 70);
  await navigator.init();
  const navUuid = pluginExecutor.newInstance("navigator", navigator);

  const simulationConfig: Simulation = {
    title: "Mining Company",
    description:
      "Simulation of a mining company which has iot connected trucks",
    startTime: moment()
      .subtract(0, "seconds")
      .format(),
    endTime: moment()
      .add(10, "second")
      .format(),
    devices: [1, 2].map(_ => ({
      id: pluginExecutor.generate("faker", "{{random.uuid}}"),
      name: "truck",
      metadata: {
        driverName: pluginExecutor.generate("faker", "{{name.findName}}")
      },
      sensors: [
        {
          id: pluginExecutor.generate("faker", "{{random.uuid}}"),
          name: "Temperature",
          metadata: {
            unit: "C",
            label: "External Temperature"
          },
          samplingRate: 1000,
          valueGenerator: () =>
            pluginExecutor.generate(
              "faker",
              '{{random.number({"min": 18, "max": 20})}}'
            )
        },
        {
          id: pluginExecutor.generate("faker", "{{random.uuid}}"),
          name: "Location",
          metadata: {
            unit: "Coords",
            label: "GPS Location"
          },
          samplingRate: 60000,
          valueGenerator: (timestamp: number) =>
            pluginExecutor.generate("navigator", timestamp, navUuid)
        }
      ],
      devices: [
        {
          id: pluginExecutor.generate("faker", "{{random.uuid}}"),
          name: "engine",
          sensors: [
            {
              id: pluginExecutor.generate("faker", "{{random.uuid}}"),
              name: "EngineTemperature",
              metadata: {
                unit: "C",
                label: "Engine Temperature"
              },
              samplingRate: 5000,
              valueGenerator: () =>
                pluginExecutor.generate(
                  "faker",
                  '{{random.number({"min": 80, "max": 100})}}'
                )
            }
          ]
        }
      ]
    })),
    outputPlugins: [
      new StdoutOutputPlugin(),
      new MindsphereOutputPlugin({
        agentConfig
      })
    ]
  };

  const sr = new SimulationRunner();
  sr.load(simulationConfig);
  await sr.run();
})();
