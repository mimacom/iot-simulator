interface StatefulGeneratorPlugin<C, R> {
  generate(config: C): R
}

interface StatefulGeneratorPluginFactory<C, I, O> {
  create(config: C): StatefulGeneratorPlugin<I, O>
}

const STATEFUL_PLUGIN_TYPE = Symbol.for('StatefulGeneratorPlugin')
const STATEFUL_PLUGIN_FACTORY_TYPE = Symbol.for('StatefulGeneratorPluginFactory')

export {
  StatefulGeneratorPlugin,
  StatefulGeneratorPluginFactory,
  STATEFUL_PLUGIN_TYPE,
  STATEFUL_PLUGIN_FACTORY_TYPE
}
