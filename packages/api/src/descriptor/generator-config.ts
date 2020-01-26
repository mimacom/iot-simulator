interface GeneratorConfig {
  mode: GenerationMode
  pluginId: string
  config: any
}

enum GenerationMode {
  INIT,
  LIVE
}

export { GeneratorConfig, GenerationMode }
