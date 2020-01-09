import 'reflect-metadata'
import StatelessFakerGeneratorPlugin from "../src/iot-simulator-faker-generator-plugin"

describe("StatelessFakerGeneratorPlugin test", () => {

  it("Generate name by string", () => {
    expect(new StatelessFakerGeneratorPlugin().generate("{{name.findName}}")).toEqual(expect.any(String));
  });
});
