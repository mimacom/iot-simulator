import NavigatorSimulator from '../src/iot-simulator-navigator-generator-plugin'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DummyClass is instantiable', () => {
    expect(new NavigatorSimulator('Start', 'End', 20)).toBeInstanceOf(NavigatorSimulator)
  })
  const navSim = new NavigatorSimulator('Start', 'End', 20)
  navSim.start()

  console.log('done test')
})
