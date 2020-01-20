const faker = require('faker')
import { StatelessGeneratorPlugin, STATELESS_PLUGIN_TYPE } from 'iot-simulator-api'
import { provideNamed } from 'iot-simulator-shared'

@provideNamed(STATELESS_PLUGIN_TYPE, 'faker')
export default class FakerGeneratorPlugin implements StatelessGeneratorPlugin<string, string> {
  generate(config: string): string {
    return faker.fake(config)
  }
}
