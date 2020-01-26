import { StatefulGeneratorPlugin } from 'iot-simulator-api'

export default class CounterGeneratorPlugin implements StatefulGeneratorPlugin<void, number> {
  private counter: number = 0

  generate(): number {
    return ++this.counter
  }
}
