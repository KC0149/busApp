import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { useImmerReducer } from "use-immer"
import StateContext from "./StateContext.jsx"
import DispatchContext from "./DispatchContext.jsx"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Main = () => {
  const initialState = {
    infoVisible: false, //check info panel on the left state
    featureProperties: [], //save properties of line clicked
    taskbar: true,
    isChecked: true, //check searchpanel on the right state
    searchOption: "vehRef", //selected search option    "vehRef" , "publishLine" , "AxisType"
    selectedVehRef: {
      value: null
    },
    selectedPublishLine: {
      value: null
    },
    selectedAxisType: {
      value: null
    },
    geoJson: {
      value: ""
    },
    runBusRouting: 0,
    combineGeoJson: {},
    toggleGeoJson: false,
    progress: 0,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "toggleInfo":
        draft.infoVisible = action.value
        return
      case "updateProperties":
        draft.featureProperties = action.value
        return
      case "taskbar":
        draft.taskbar = action.value
        draft.isChecked = action.value
        return

      case "toggleSelection":
        draft.searchOption = action.value
        return
      case "selectedVehRef":
        draft.selectedVehRef.value = action.value
        return
      case "selectedPublishLine":
        draft.selectedPublishLine.value = action.value
        return
      case "selectedAxisType":
        draft.selectedAxisType.value = action.value
        return
      case "getGeojson":
        draft.geoJson.value = action.value
        return
      case "combineGeojson":
        draft.combineGeoJson = action.value
        return
      case "toggleGeojson":
        draft.toggleGeoJson = action.value
        return

      case "runBusRouting":
        draft.runBusRouting = action.value
        return
      case "updateProgress":
        draft.progress = action.value
        return
    
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  return (
    <React.StrictMode>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <App />
        </DispatchContext.Provider>
      </StateContext.Provider>
      <ToastContainer />
    </React.StrictMode>
  )
}
export default Main
ReactDOM.createRoot(document.getElementById("root")).render(<Main />)
