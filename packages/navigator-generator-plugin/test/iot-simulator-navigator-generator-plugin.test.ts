import 'reflect-metadata'
import NavigatorSimulator from '../src/iot-simulator-navigator-generator-plugin'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DummyClass is instantiable', () => {
    expect(new NavigatorSimulator('Town Hall, Sydney, NSW', 'Parramatta, NSW', 20)).toBeInstanceOf(
      NavigatorSimulator
    )
  })
  const navSim = new NavigatorSimulator('Town Hall, Sydney, NSW', 'Parramatta, NSW', 20)
  navSim.start()

  console.log('done test')
})
