// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
  // import "core-js/fn/array.find"
  // ...
import {injectable} from "inversify";
import * as Faker from "faker";
import "reflect-metadata";
import {StatelessGeneratorPlugin} from "iot-simulator-shared";

@injectable()
export default class StatelessFakerGeneratorPlugin implements StatelessGeneratorPlugin<string, string> {

  generate(config: any): any {
    return Faker.fake(config);
  }
}
