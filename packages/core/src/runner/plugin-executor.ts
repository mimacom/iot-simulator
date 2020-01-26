import { Container } from 'inversify'
import { buildProviderModule } from 'inversify-binding-decorators'
import {
  STATEFUL_PLUGIN_TYPE,
  StatefulGeneratorPlugin,
  STATELESS_PLUGIN_TYPE,
  StatelessGeneratorPlugin
} from 'iot-simulator-api'
const uuidv4 = require('uuid/v4')

class PluginExecutor {
  private container: Container

  constructor() {
    this.container = new Container()
    this.container.load(buildProviderModule())
  }

  public newInstance(pluginId: string, plugin: StatefulGeneratorPlugin<any, any>) {
    const instanceid = uuidv4()
    this.container
      .bind<StatefulGeneratorPlugin<any, any>>(STATEFUL_PLUGIN_TYPE)
      .toConstantValue(plugin)
      .whenTargetNamed(`${pluginId}-${instanceid}`)
    return instanceid
  }

  public generate(pluginId: string, instanceId: string, config: any) {
    if (instanceId) {
      return this.container
        .getNamed<StatefulGeneratorPlugin<any, any>>(
          STATEFUL_PLUGIN_TYPE,
          `${pluginId}-${instanceId}`
        )
        .generate(config)
    } else {
      return this.container
        .getNamed<StatelessGeneratorPlugin<any, any>>(STATELESS_PLUGIN_TYPE, pluginId)
        .generate(config)
    }
  }
}

export { PluginExecutor }
