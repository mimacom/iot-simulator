import 'reflect-metadata'
import { FakerGeneratorPlugin } from '../src/iot-simulator-faker-generator-plugin'

describe('StatelessFakerGeneratorPlugin test', () => {
  it('Generate random name', () => {
    expect(new FakerGeneratorPlugin().generate('{{name.findName}}')).toEqual(expect.any(String))
  })
})
