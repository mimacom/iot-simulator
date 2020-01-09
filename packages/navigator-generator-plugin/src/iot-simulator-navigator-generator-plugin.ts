import { StatefulGeneratorPlugin, STATEFUL_TYPE, provideNamed, GeoLocation } from 'iot-simulator-shared'

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

  constructor(startLocation: String, endLocation: String, speed: number) {
    this.startLocation = startLocation
    this.endLocation = endLocation
    this.speed = speed
  }
  start() {
    googleMapsClient
      .directions({
        origin: 'Town Hall, Sydney, NSW',
        destination: 'Parramatta, NSW'
      })
      .asPromise()
      .then((response: any) => {
        console.log(response.json)
      })
      .catch((err: any) => console.log(err))
    this.lastTimeStamp = Date.now()
  }
  next(): GeoLocation {
    this.lastTimeStamp = Date.now()
    console.log(this.lastTimeStamp)
    return new GeoLocation(47.3459679, 9.8862023, 20)
  }
}
