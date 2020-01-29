import "reflect-metadata";
import * as moment from "moment";
import * as fs from "fs";

import { Simulation } from "@iot-simulator/api";
import { PluginExecutor, SimulationRunner, StdoutOutputPlugin } from "@iot-simulator/core";
import { MindsphereOutputPlugin } from "@iot-simulator/mindsphere-output-plugin";

(async () => {
  const agentConfigFile: string = fs.readFileSync("./agentconfig.json", {
    encoding: "UTF-8"
  });
  const agentConfig = JSON.parse(agentConfigFile);

  const pluginExecutor = new PluginExecutor();

  //const navigator = new NavigatorGeneratorPlugin("Stuttgart ", "Frankfurt", 70);
  //await navigator.init();
  //const navUuid = pluginExecutor.newInstance("navigator", navigator);

  const simulationConfig: Simulation = {
    title: "Mining Company",
    description:
      "Simulation of a mining company which has iot connected trucks",
    startTime: moment()
      .subtract(5, "seconds")
      .format(),
    endTime: moment()
      .add(5, "seconds")
      .format(),
    devices: [1].map(_ => ({
      id: pluginExecutor.generate("faker", "{{random.uuid}}"),
      name: "truck",
      metadata: {
        driverName: pluginExecutor.generate("faker", "{{name.findName}}")
      },
      sensors: [
        /*
        {
          id: pluginExecutor.generate("faker", "{{random.uuid}}"),
          name: "Humidity",
          metadata: {
            unit: "%",
            label: "Humidity"
          },
          samplingRate: 1000 * 60 * 30,
          valueGenerator: () =>
            pluginExecutor.generate(
              "faker",
              '{{random.number({"min": 75, "max": 85})}}'
            )
        },
        {
          id: pluginExecutor.generate("faker", "{{random.uuid}}"),
          name: "Pressure",
          metadata: {
            unit: "kPA",
            label: "Pressure"
          },
          samplingRate: 1000 * 60 * 20,
          valueGenerator: () =>
            pluginExecutor.generate(
              "faker",
              '{{random.number({"min": 100, "max": 104, "precision": 0.1})}}'
            )
        },
        */
        {
          id: pluginExecutor.generate("faker", "{{random.uuid}}"),
          name: "Temperature",
          metadata: {
            unit: "C",
            label: "Temperature"
          },
          samplingRate: 1000,
          valueGenerator: () =>
            pluginExecutor.generate(
              "faker",
              '{{random.number({"min": 16, "max": 21, "precision": 0.1})}}'
            )
        } /*,
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
        }*/
      ],
      /*
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
              samplingRate: 1000 * 60 * 15,
              valueGenerator: () =>
                pluginExecutor.generate(
                  "faker",
                  '{{random.number({"min": 80, "max": 85})}}'
                )
            }
          ]
        },
        {
          id: pluginExecutor.generate("faker", "{{random.uuid}}"),
          name: "tires",
          sensors: [
            {
              id: pluginExecutor.generate("faker", "{{random.uuid}}"),
              name: "TirePressure",
              metadata: {
                unit: "C",
                label: "Average Pressure"
              },
              samplingRate: 1000 * 60 * 10,
              valueGenerator: () =>
                pluginExecutor.generate(
                  "faker",
                  '{{random.number({"min": 2, "max": 3, "precision": 0.01})}}'
                )
            }
          ]
        }
      ]*/
    })),
    outputPlugins: [
      new StdoutOutputPlugin(),
      //new MindsphereOutputPlugin({
      //  agentConfig
      //})
    ]
  };

  const sr = new SimulationRunner();
  sr.load(simulationConfig);
  await sr.run();
  console.log("Done")
})();
