interface StatefulGeneratorPlugin<T> {
  next(): T
}

const STATEFUL_TYPE = Symbol.for('StatefulGeneratorPlugin')


interface StatelessGeneratorPlugin<P, T> {
  generate(config: P): T
}

const STATELESS_TYPE = Symbol.for('StatelessGeneratorPlugin')


export { StatelessGeneratorPlugin, StatefulGeneratorPlugin, STATELESS_TYPE, STATEFUL_TYPE }

