import * as faker from 'faker'
import { StatelessGeneratorPlugin, STATELESS_TYPE, provideNamed } from 'iot-simulator-shared'

@provideNamed(STATELESS_TYPE, 'faker')
export default class StatelessFakerGeneratorPlugin
  implements StatelessGeneratorPlugin<string, string> {
  generate(config: string): string {
    return faker.fake(config)
  }
}
