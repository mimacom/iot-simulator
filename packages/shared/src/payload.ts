export interface Payload {
  // title: string;
  // description: string;
  // randomSeed: string;
  // startTime: string;
  // stopTime: string;
  devices: Device[]
}

export interface Metadata {
  type: string
  driver: string
  weight: string
}

export interface Sensor {
  id: string
  // label: string;
  unitLabel?: string
  unit?: string
  // samplingRate: number;
  value: string
}

export interface Device {
  // uuid: string;
  // instances: number;
  // metadata: Metadata;
  sensors: Sensor[]
  // devices: Device[];
}
