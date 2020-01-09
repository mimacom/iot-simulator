import { Payload } from './payload'

interface OutputPlugin {
  send: (payload: Payload) => void
}

const OUTPUT_TYPE = Symbol.for('OutputPlugin')

export { OutputPlugin, OUTPUT_TYPE }
