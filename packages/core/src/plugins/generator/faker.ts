const faker = require('faker')
import { StatelessGeneratorPlugin, STATELESS_PLUGIN_TYPE } from '@iot-simulator/api'
import { provideNamed } from '@iot-simulator/common'

@provideNamed(STATELESS_PLUGIN_TYPE, 'faker')
class FakerGeneratorPlugin implements StatelessGeneratorPlugin<string, string> {
  generate(config: string): string {
    return faker.fake(config)
  }
}

export { FakerGeneratorPlugin }
