interface StatelessGeneratorPlugin<P, T> {
  generate(config: P): T
}

const STATELESS_PLUGIN_TYPE = Symbol.for('StatelessGeneratorPlugin')

export { StatelessGeneratorPlugin, STATELESS_PLUGIN_TYPE }
