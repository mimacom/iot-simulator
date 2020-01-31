import { StatefulGeneratorPlugin } from '@iot-simulator/api'

class SimpleMovingAverageGeneratorPlugin implements StatefulGeneratorPlugin<void, string> {
  private buffer: number[]

  constructor(
    private min: number,
    private max: number,
    private precision: number = 0,
    private bufferSize: number = 5
  ) {}

  generate(): string {
    const value = this.getRandom()
    if (!this.buffer) {
      this.buffer = Array(this.bufferSize).fill(value)
    }
    this.buffer.push(value)
    this.buffer.shift()
    const avg = this.buffer.reduce((prev, curr) => prev + curr, 0) / this.bufferSize
    return avg.toPrecision(this.precision)
  }

  private getRandom() {
    return Math.random() * (this.max - this.min) + this.min
  }
}

export { SimpleMovingAverageGeneratorPlugin }
