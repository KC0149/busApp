export interface GeojsonType {
  type: "FeatureCollection" | "Feature" | "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon"
  features: Feature[]
}

export interface Feature {
  type: FeatureType
  geometry: Geometry
  properties: FeatureProperties
}

export interface Geometry {
  type: GeometryType
  coordinates: Array<number[] | number>
}

export enum GeometryType {
  LineString = "LineString",
  Point = "Point"
}

export interface FeatureProperties {
  VehicleRef: string
  PublishedLineName: string
  DirectionRef: string
  OriginName: string
  DestinationName: string
  StartTime: Date
  EndTime: Date
  NumOfPoints: string
  "Point 1 geom": string
  "Point 1 arrival": string
  "Point 1 dist from stop": string
  "Point 1 time": Date
  "Point 2 geom"?: string
  "Point 2 arrival"?: string
  "Point 2 dist from stop"?: string
  "Point 2 time"?: Date
  "Point 3 geom"?: string
  "Point 3 arrival"?: string
  "Point 3 dist from stop"?: string
  "Point 3 time"?: Date
  "Point 4 geom"?: string
  "Point 4 arrival"?: string
  "Point 4 dist from stop"?: string
  "Point 4 time"?: Date
  "Point 5 geom"?: string
  "Point 5 arrival"?: string
  "Point 5 dist from stop"?: string
  "Point 5 time"?: Date
  "Point 6 geom"?: string
  "Point 6 arrival"?: string
  "Point 6 dist from stop"?: string
  "Point 6 time"?: Date
  "point type"?: string
}

export enum PointArrival {
  Approaching = "approaching",
  AtStop = "at stop",
  The1StopAway = "< 1 stop away"
}

export enum FeatureType {
  Feature = "Feature"
}
