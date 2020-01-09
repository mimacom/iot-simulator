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
  for (let i = 0; i < 5; i++) {
    setTimeout(navSim.next, 1000)
  }
  console.log('done test')
})
