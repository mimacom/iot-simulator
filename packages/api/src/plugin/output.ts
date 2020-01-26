import { Observable } from 'rxjs'

interface OutputPlugin {
  registerSource(source: Observable<any>): void

  setTransformFunction(mapper: Function): void
}

export { OutputPlugin }
