interface OutputPlugin {
  send: (payload: any) => void
}

const OUTPUT_PLUGIN_TYPE = Symbol.for('OutputPlugin')

export { OutputPlugin, OUTPUT_PLUGIN_TYPE }
