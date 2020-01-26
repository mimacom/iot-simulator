import { StatefulGeneratorPlugin } from 'iot-simulator-api'
import { builderOf } from 'iot-simulator-shared'
import { GeoLocation } from './geo-location'
const polyline = require('polyline-extended')

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.API_KEY,
  Promise: Promise
})

class NavigatorGeneratorPlugin implements StatefulGeneratorPlugin<number, GeoLocation> {
  lastInstant?: number
  points: any[] = []
  currentIdx = 0

  constructor(private startLocation: string, private endLocation: string, private speed: number) {
    this.startLocation = startLocation
    this.endLocation = endLocation
    this.speed = speed
  }

  async init(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await googleMapsClient
          .directions({
            origin: this.startLocation,
            destination: this.endLocation,
            units: 'metric'
          })
          .asPromise()

        // get the interesting information
        const steps = response.json.routes[0].legs[0].steps || []
        // decode and unwrap polyline data
        const unwraped = steps
          .map((step: any) => polyline.decode(step.polyline.points))
          .reduce((prev: any, curr: any) => prev.concat(curr), [])
        // convert to object and calculate distance
        this.points = unwraped.map((elem: any, idx: number, data: any[]) => {
          return {
            lat: elem[0],
            lng: elem[1],
            distance: idx === 0 ? 0 : polyline.haversineDistance(data[idx - 1], elem)
          }
        })
        resolve()
      } catch (e) {
        console.error(e)
        reject()
      }
    })
  }

  generate(timestamp?: number): GeoLocation {
    const instant = timestamp || Date.now()
    let delta = 0
    if (this.lastInstant) {
      // delta in hours
      delta = (instant - this.lastInstant) / (1000 * 3600)
    }
    if (delta > 0) {
      // distance we should have travelled based on the speed
      const deltaDistance = this.speed * delta
      let accumulatedDistance = 0
      do {
        this.currentIdx++
        accumulatedDistance += this.points[this.currentIdx].distance
      } while (accumulatedDistance < deltaDistance)
    }

    this.lastInstant = instant

    return (
      builderOf<GeoLocation>()
        .latitude(this.points[this.currentIdx].lat)
        .longitude(this.points[this.currentIdx].lng)
        // adapt to the current speed when we implement variable speed
        .speed(this.speed)
        .build()
    )
  }
}

export { NavigatorGeneratorPlugin }
