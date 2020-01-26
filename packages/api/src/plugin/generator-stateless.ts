interface StatelessGeneratorPlugin<C, R> {
  generate(config: C): R
}

const STATELESS_PLUGIN_TYPE = Symbol.for('StatelessGeneratorPlugin')

export { StatelessGeneratorPlugin, STATELESS_PLUGIN_TYPE }
