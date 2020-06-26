# IoT Simulator

IoT simulator is a pluggable iot simulation library that can parse a simulation configuration and generate semi realistic data using various plugins


## Development

To start developing on the IoT simulator you first need to install [Lerna](https://lerna.js.org) and bootstrap the dependencies:

```bash
$ npm install --global lerna
$ lerna bootstrap
```

Now that the dependencies are in place you can build the packages in the following order:

```bash
lerna run build --scope=@iot-simulator/api
lerna run build --scope=@iot-simulator/common
lerna run build --scope=@iot-simulator/core
lerna run build --scope=@iot-simulator/navigator-generator-plugin
lerna run build --scope=@iot-simulator/mindsphere-output-plugin
lerna run build --scope=@iot-simulator/mqtt-output-plugin
lerna run build --scope=@iot-simulator/tester
```
