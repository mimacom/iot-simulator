import { Container } from 'inversify'
import { buildProviderModule } from 'inversify-binding-decorators'
import {
  STATEFUL_PLUGIN_TYPE,
  StatefulGeneratorPlugin,
  STATELESS_PLUGIN_TYPE,
  StatelessGeneratorPlugin
} from 'iot-simulator-api'

class PluginExecutor {
  private container: Container

  constructor() {
    this.container = new Container()
    this.container.load(buildProviderModule())
  }

  public generate(pluginId: string, instanceId: string, config: any) {
    if (instanceId) {
      return this.container
        .getNamed<StatefulGeneratorPlugin<any>>(STATEFUL_PLUGIN_TYPE, `${pluginId}-${instanceId}`)
        .next()
    } else {
      return this.container
        .getNamed<StatelessGeneratorPlugin<any, any>>(STATELESS_PLUGIN_TYPE, pluginId)
        .generate(config)
    }
  }
}

export { PluginExecutor }
