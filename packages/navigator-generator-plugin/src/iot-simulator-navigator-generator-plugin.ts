import {
  StatefulGeneratorPlugin,
  STATEFUL_TYPE,
  provideNamed,
  GeoLocation
} from 'iot-simulator-shared'
import { setPriority } from 'os'
import { setupMaster } from 'cluster'
import { GeocodedWaypoint } from '@google/maps'

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.API_KEY,
  Promise: Promise
})
@provideNamed(STATEFUL_TYPE, 'navigator')
export default class NavigatorSimulator implements StatefulGeneratorPlugin<GeoLocation> {
  startLocation!: String
  endLocation!: String
  speed!: number
  lastTimeStamp!: number
  locations!: any[]
  constructor(startLocation: String, endLocation: String, speed: number) {
    this.startLocation = startLocation
    this.endLocation = endLocation
    this.speed = speed
  }
  start() {
    googleMapsClient
      .directions({
        origin: this.startLocation,
        destination: this.endLocation,
        units: 'metric'
      })
      .asPromise()
      .then((response: any) => {
        let waypoints = response.json.routes[0].legs[0].steps
        let locations = waypoints.map((waypoint: any) => {
          return {
            location: waypoint.start_location,
            distance: waypoint.distance,
            duration: waypoint.duration
          }
        })

        locations.push({
          location: response.json.routes[0].legs[0].end_location,
          distance: response.json.routes[0].legs[0].distance,
          duration: response.json.routes[0].legs[0].duration
        })
        console.log(locations)
      })
      .catch((err: any) => console.log(err))
    this.lastTimeStamp = Date.now()
  }
  next(): GeoLocation {
    let difference = (Date.now() - this.lastTimeStamp) / 1000
    this.lastTimeStamp = Date.now()
    return new GeoLocation(47.3459679, 9.8862023, 20)
  }
}
