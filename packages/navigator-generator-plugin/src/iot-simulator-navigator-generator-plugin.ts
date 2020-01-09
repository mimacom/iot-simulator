import {
  StatefulGeneratorPlugin,
  STATEFUL_TYPE,
  provideNamed,
  GeoLocation
} from 'iot-simulator-shared'

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
  index = 0
  constructor(startLocation: String, endLocation: String, speed: number) {
    this.startLocation = startLocation
    this.endLocation = endLocation
    this.speed = speed
  }
  init(): Promise<Boolean> {
    return googleMapsClient
      .directions({
        origin: this.startLocation,
        destination: this.endLocation,
        units: 'metric'
      })
      .asPromise()
      .then((response: any) => {
        let waypoints = response.json.routes[0].legs[0].steps
        let sum = 0
        this.locations = waypoints.map((waypoint: any) => {
          sum = waypoint.duration.value + sum
          return {
            location: waypoint.start_location,
            distance: waypoint.distance,
            duration: waypoint.duration,
            totalDuration: sum
          }
        })

        this.locations.push({
          location: response.json.routes[0].legs[0].end_location,
          distance: response.json.routes[0].legs[0].distance,
          duration: response.json.routes[0].legs[0].duration
        })
        console.log(this.locations)
        return new Promise((resolve, reject) => resolve('success'))
      })
      .catch((err: any) => {
        console.log(err)
        return new Promise((resolve, reject) => reject('failed'))
      })
  }
  start() {
    this.lastTimeStamp = Date.now()
  }
  next(): GeoLocation {
    let difference = (Date.now() - this.lastTimeStamp) / 1000
    let i = 0
    while (this.locations[i].totalDuration <= difference) {
      i++
    }
    this.lastTimeStamp = Date.now()
    return new GeoLocation(this.locations[i].location.lat, this.locations[i].location.lng, 20)
  }
}
