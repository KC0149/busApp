import { createContext } from "react"

// Define action types using string literals
export type ActionType =
  | "toggleInfo"
  | "updateProperties"
  | "taskbar"
  | "toggleSelection"
  | "selectedVehRef"
  | "selectedPublishLine"
  | "selectedAxisType"
  | "getGeojson"
  | "combineGeojson"
  | "toggleGeojson"
  | "runBusRouting"
  | "updateProgress"

// Define action interface with a discriminated union
export type Action = {
  type: ActionType
  value: any // Type according to your requirements
}

const DispatchContext = createContext<React.Dispatch<Action> | null>(null)
export default DispatchContext
