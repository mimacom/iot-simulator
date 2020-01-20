interface StatefulGeneratorPlugin<T> {
  next(): T
}

const STATEFUL_PLUGIN_TYPE = Symbol.for('StatefulGeneratorPlugin')

export { StatefulGeneratorPlugin, STATEFUL_PLUGIN_TYPE }
