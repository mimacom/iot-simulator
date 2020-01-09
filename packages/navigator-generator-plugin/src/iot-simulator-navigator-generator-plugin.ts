import { StatefulGeneratorPlugin } from '../../shared/src/generator-plugin'
import GeoLocation from '../../shared/src/geolocation'
const googleMapsClient = require('@google/maps')
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
      .geocode({
        address: 'Sydney Opera House'
      })
      .asPromise()
    this.lastTimeStep = Date.now()
  }
  next(): GeoLocation {
    this.lastTimeStep = Date.now()
    console.log(this.lastTimeStep)
    return new GeoLocation(47.3459679, 9.8862023)
  }
}
