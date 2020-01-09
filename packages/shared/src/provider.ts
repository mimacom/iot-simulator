import { fluentProvide } from 'inversify-binding-decorators'

const provideNamed = (identifier: symbol, name: string) => {
  return fluentProvide(identifier)
    .whenTargetNamed(name)
    .done()
}

export { provideNamed }
