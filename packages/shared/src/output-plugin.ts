interface OutputPlugin {
  send: (payload: Payload) => void
}

const TYPE = Symbol.for('OutputPlugin')

export { OutputPlugin, TYPE }
