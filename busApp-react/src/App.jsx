import { useContext, useEffect, useState } from "react"
import "./App.css"
import axios from "axios"
import { useImmerReducer } from "use-immer"
import Map from "./components/Map"

import Loader from "./components/Loader"
import DispatchContext from "./DispatchContext"
import StateContext from "./StateContext"

import Navbar from "./components/Navbar"
import AxisType from "./components/AxisType"
import SelectionBox from "./components/SelectionBox"
import { toast } from "react-toastify"

function App() {
  const [server, setServer] = useState("Wait")
  const [vehRef, setVehRef] = useState([])
  const [publishLine, setPublishLine] = useState([])
  const [axisType, setAxisType] = useState([])

  const [isloading, setisLoading] = useState(false)

  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const initialState = {
    //To convert this string back into an array, you need to use JSON.parse()
    vehRefHistory: JSON.parse(localStorage.getItem("vehRefHistory")) || [],
    publishlineHistory: JSON.parse(localStorage.getItem("publishlineHistory")) || [],
    axisTypeHistory: JSON.parse(localStorage.getItem("axisTypeHistory")) || []
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "saveHistory":
        let key, history
        if (appState.searchOption === "vehRef") {
          key = "vehRefHistory"
          history = "vehRefHistory"
        } else if (appState.searchOption === "publishLine") {
          key = "publishlineHistory"
          history = "publishlineHistory"
        } else {
          key = "axisTypeHistory"
          history = "axisTypeHistory"
        }

        let newValue = action.value
        let existingIndex = draft[key].indexOf(newValue)

        // If the value already exists in the history
        if (existingIndex !== -1) {
          // Remove the existing value from its current position
          draft[key].splice(existingIndex, 1)
        }

        // Append the new value to the end of the history array
        draft[key].unshift(newValue)

        // If the history exceeds 5 items, keep the latest 5 items
        if (draft[key].length > 5) {
          draft[key] = draft[key].slice(0, 5)
        }

        // Save the updated history array to local storage

        localStorage.setItem(history, JSON.stringify(draft[key]))

        return

      case "clearHistory":
        if (appState.searchOption === "vehRef") {
          localStorage.removeItem("vehRefHistory")
          draft.vehRefHistory = []
        } else if (appState.searchOption === "publishLine") {
          localStorage.removeItem("publishlineHistory")
          draft.publishlineHistory = []
        } else {
          localStorage.removeItem("axisTypeHistory")
          draft.axisTypeHistory = []
        }
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  //check server
  useEffect(() => {
    async function checkServer() {
      try {
        const response = await axios.get("https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip/ready")
        console.log(response)

        const secondResponse = await axios.get("https://nyc-bus-routing-k3q4yvzczq-an.a.run.app/ready")
        console.log(secondResponse)

        //check if both server is ready first
        if (response.data.status === "Ready" && secondResponse.data === "Ready") {
          // If the server is ready, stop checking by clearing the interval
          clearInterval(intervalId)
          setServer("Ready")
        } else {
          setServer("Wait")
        }
      } catch (e) {
        console.log("There was a problem.", e)
      }
    }

    //stop when ready and cut the interval
    const intervalId = setInterval(() => {
      checkServer()
    }, 1000)
    // return () => clearInterval(intervalId)
  }, [])

  //get veh number
  useEffect(() => {
    async function vehRef() {
      try {
        const response = await axios.get("https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip/getVehRef")
        if (response) {
          setVehRef(response.data)
          console.log(response)
        }
      } catch (e) {
        console.log("There was a problem.", e)
      }
    }
    vehRef()
  }, [])

  //get all publish line number
  useEffect(() => {
    async function getPublishline() {
      try {
        const response = await axios.get("https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip/getPubLineName")
        console.log(response)
        if (response) {
          setPublishLine(response.data)
        }
      } catch (e) {
        console.log("There was a problem.", e)
      }
    }
    getPublishline()
  }, [])

  //get all axis types
  useEffect(() => {
    if (server != "Wait") {
      async function getAxisType() {
        try {
          const response = await axios.get("https://nyc-bus-routing-k3q4yvzczq-an.a.run.app/allAxisTypes")
          if (response) {
            setAxisType(response.data)
          }
        } catch (e) {
          console.log("There was a problem.", e)
        }
      }
      getAxisType()
    }
  }, [server])

  //vehref options for react-select
  let axisTypeOptions, vehRefOptions, publishLineOptions
  if (server !== "Wait") {
    vehRefOptions = vehRef.sort((a, b) => a.localeCompare(b)).map(vehRef => ({ label: vehRef, value: vehRef }))

    //publishline options for react-select
    publishLineOptions = publishLine.sort((a, b) => a.localeCompare(b)).map(publishLine => ({ label: publishLine, value: publishLine }))
    if (axisType) {
      axisTypeOptions = axisType?.map(axisType => ({ label: axisType, value: axisType }))
    }
  }

  //to show on map
  async function handleChangeVehref(vehref) {
    if (vehRef) {
      setisLoading(true)

      try {
        const response = await axios.get(`https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip/getBusTripByVehRef/${vehref}`)
        console.log(response)
        if (response) {
          setisLoading(false)

          appDispatch({ type: "getGeojson", value: response.data })
          dispatch({ type: "saveHistory", value: vehref })

          appDispatch({ type: "toggleInfo", value: false })
          appDispatch({ type: "toggleGeojson", value: false })
          appDispatch({ type: "runBusRouting", value: true })
          toast.success(`Displaying ${vehref}`, {
            position: "top-left"
          })
        }
      } catch (e) {
        console.log("There was a problem.", e)
        toast.error(`There was an error, reload page.`, {
          position: "top-left"
        })
      }
    }
  }

  async function handleChangePubLine(publishLine) {
    setisLoading(true)

    try {
      const response = await axios.get(`https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip/getBusTripByPubLineName/${publishLine}`)
      if (response) {
        appDispatch({ type: "getGeojson", value: response.data })
        dispatch({ type: "saveHistory", value: publishLine })

        appDispatch({ type: "toggleInfo", value: false })
        appDispatch({ type: "runBusRouting", value: true })
        toast.success(`Displaying ${publishLine}`, {
          position: "top-left"
        })
      }
    } catch (e) {
      console.log("There was a problem.", e)
      toast.error(`There was an error, reload page.`, {
        position: "top-left"
      })
    }
  }

  async function handleChangeAxisType(axisType) {
    setisLoading(true)

    try {
      const response = await axios.get(`https://nyc-bus-routing-k3q4yvzczq-an.a.run.app/axisType/${axisType}`)
      if (response) {
        appDispatch({ type: "getGeojson", value: response.data })
        dispatch({ type: "saveHistory", value: axisType })

        appDispatch({ type: "toggleInfo", value: false })
        setisLoading(false)
      }
    } catch (e) {
      console.log("There was a problem.", e)
      setisLoading(false)
    }
  }

  async function handleChangeAxisType(axisType) {
    setisLoading(true)

    try {
      const response = await axios.get(`https://nyc-bus-routing-k3q4yvzczq-an.a.run.app/axisType/${axisType}`)
      if (response) {
        appDispatch({ type: "getGeojson", value: response.data })
        dispatch({ type: "saveHistory", value: axisType })

        appDispatch({ type: "toggleInfo", value: false })
        setisLoading(false)
      }
    } catch (e) {
      console.log("There was a problem.", e)
      setisLoading(false)
    }
  }

  function clearSearch() {
    if (window.confirm("Are you sure you want to clear history?")) {
      dispatch({ type: "clearHistory" })
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <Navbar isloading={isloading} />

      <div className="w-full relative overflow-hidden ">
        <div className={`map  z-1 transition-all ease-in-out duration-300  ${appState.taskbar ? "w-screen" : "w-full"}`}>
          <Map geojson={appState.toggleGeoJson ? appState.combineGeoJson : appState.geoJson.value} setisLoading={setisLoading} />
        </div>

        <div
          className={` glass flex flex-col right-0 top-24 mr-1 py-7  z-[999] px-10 items-center  min-w-[300px] ease-in-out duration-300 absolute ${
            appState.taskbar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            type="button"
            className="rounded-md p-2  text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 self-end ml-auto"
            onClick={e => appDispatch({ type: "taskbar", value: appState.isChecked ? false : true })}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {server === "Wait" ? (
            <div>
              <p className="block mb-3 text-xs md:text-sm text-indigo-500 font-medium">
                Server:<span className={`text-${server === "Wait" ? "red-500" : "indigo-700"}`}>{server}</span>{" "}
              </p>
              <Loader />
            </div>
          ) : appState.searchOption === "vehRef" ? (
            <SelectionBox
              options={vehRefOptions}
              isloading={isloading}
              handleChange={e => handleChangeVehref(e)}
              selectedValue={appState.selectedVehRef.value}
              selectedHistory={state.vehRefHistory}
              clearSearch={e => clearSearch(e)}
            />
          ) : appState.searchOption === "publishLine" ? (
            <SelectionBox
              options={publishLineOptions}
              isloading={isloading}
              handleChange={e => handleChangePubLine(e)}
              selectedValue={appState.selectedPublishLine.value}
              selectedHistory={state.publishlineHistory}
              clearSearch={e => clearSearch(e)}
            />
          ) : (
            <SelectionBox
              options={axisTypeOptions}
              isloading={isloading}
              handleChange={e => handleChangeAxisType(e)}
              selectedValue={appState.selectedAxisType.value}
              selectedHistory={state.axisTypeHistory}
              clearSearch={e => clearSearch(e)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
