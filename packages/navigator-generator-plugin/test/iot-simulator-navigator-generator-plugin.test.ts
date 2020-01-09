import 'reflect-metadata'
import NavigatorSimulator from '../src/iot-simulator-navigator-generator-plugin'

/**
 * Dummy test
 */
describe('Dummy test', async () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DummyClass is instantiable', async () => {
    const navSim = new NavigatorSimulator('Town Hall, Sydney, NSW', 'Parramatta, NSW', 20)
    await navSim.init()
    navSim.start()
    console.log(navSim.next())
    // wait 10 seconds if feeling fancy
    console.log(navSim.next())
  })

  console.log('done test')
})
