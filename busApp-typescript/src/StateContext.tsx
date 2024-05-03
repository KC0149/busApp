import { createContext } from "react"
import { FeatureProperties, GeojsonType } from "./components/Geojson"

export type State = {
  infoVisible: boolean
  featureProperties: FeatureProperties | []
  taskbar: boolean
  isChecked: boolean
  searchOption: string
  selectedVehRef: { value: string | null }
  selectedPublishLine: { value: string | null }
  selectedAxisType: { value: string | null }
  geoJson: GeojsonType
  runBusRouting: number
  combineGeoJson: GeojsonType
  toggleGeoJson: boolean
  progress: string
}

const StateContext = createContext<State | undefined>(undefined)
export default StateContext
