import IotSimulatorMindsphereOutputPlugin from "../src/iot-simulator-mindsphere-output-plugin"
import { IMindConnectConfiguration } from '@mindconnect/mindconnect-nodejs';

/**
 * Dummy test
 */
describe("Dummy test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy()
  });

  it("IotSimulatorMindsphereOutputPlugin is instantiable", () => {
    const mindConnectConfiguration: IMindConnectConfiguration = require("../src/agentconfig.json");
    expect(new IotSimulatorMindsphereOutputPlugin(mindConnectConfiguration)).toBeInstanceOf(IotSimulatorMindsphereOutputPlugin)
  });

  it('Should Send Data to Mindsphere', async () => {
    const mindConnectConfiguration: IMindConnectConfiguration = require("../src/agentconfig.json");
    await new IotSimulatorMindsphereOutputPlugin(mindConnectConfiguration).send({
      devices: [
        {
          sensors: [
            {
              id: 'Temperature',
              value: '20'
            },
            {
              id: 'EngineTemperature',
              value: '90'
            }
          ]
        }
      ]
    });
  });

});
