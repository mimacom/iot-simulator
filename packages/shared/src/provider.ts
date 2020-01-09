import { fluentProvide } from 'inversify-binding-decorators'

const provideNamed = (identifier: Symbol, name: string) => {
  return fluentProvide(identifier)
    .whenTargetNamed(name)
    .done()
}

export { provideNamed }
