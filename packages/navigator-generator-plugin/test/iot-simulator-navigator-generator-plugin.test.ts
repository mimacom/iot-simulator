import 'reflect-metadata'
import { NavigatorSimulator } from '../src/iot-simulator-navigator-generator-plugin'
import moment from 'moment'

/**
 * Dummy test
 */
describe('Dummy test', async () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DummyClass is instantiable', async () => {
    const navSim = new NavigatorSimulator('Stuttgart, DE', 'Frankfurt, DE', 70)
    await navSim.init()
    console.log(navSim.generate())
    console.log(navSim.generate(moment().add(1, 'hour').valueOf()))
  })

  console.log('done test')
})
