import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { OutputPlugin } from '@iot-simulator/api'

class StdoutOutputPlugin implements OutputPlugin {
  private mapper: Function

  constructor() {
    this.mapper = (i: any) => i
  }

  registerSource(source: Observable<any>): void {
    source
      .pipe(map((data: any) => this.mapper(data)))
      .subscribe((payload: any) => console.log(payload))
  }

  setTransformFunction(mapper: Function): void {
    this.mapper = mapper
  }
}

export { StdoutOutputPlugin }
