export default class GeoLocation {
  latitude!: number
  longitude!: number
  currentSpeed: number
  constructor(latitude: number, longitude: number, speed: number) {
    this.latitude = latitude
    this.longitude = longitude
    this.currentSpeed = speed
  }
}
