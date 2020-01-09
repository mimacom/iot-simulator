import { StatefulGeneratorPlugin } from '../../shared/src/generator-plugin'
import GeoLocation from '../../shared/src/geolocation'

const googleMapsClient = require('@google/maps').createClient({
  key: 'API Key'
})
export default class NavigatorSimulator implements StatefulGeneratorPlugin<GeoLocation> {
  startLocation!: String
  endLocation!: String
  speed!: number
  lastTimeStep!: number

  constructor(startLocation: String, endLocation: String, speed: number) {
    this.startLocation = startLocation
    this.endLocation = endLocation
    this.speed = speed
  }
  start() {
    googleMapsClient
      .snapToRoads({
        path: [
          [60.17088, 24.942795],
          [60.170879, 24.942796],
          [60.170877, 24.942796]
        ]
      })
      .asPromise()
      .then(response => {
        console.log(response.json.snappedPoints)
      })
      .catch(err => console.log(err))
    this.lastTimeStep = Date.now()
  }
  next(): GeoLocation {
    this.lastTimeStep = Date.now()
    console.log(this.lastTimeStep)
    return new GeoLocation(47.3459679, 9.8862023, 20)
  }
}
