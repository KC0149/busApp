import React, { useContext, ComponentType } from "react"
import { FaSearchLocation, FaTrash } from "react-icons/fa"
import { BsClockHistory } from "react-icons/bs"
import Select, { type MenuListProps } from "react-select"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import ProgressBar from "./ProgressBar"
import { FixedSizeList as List } from "react-window"
import type {} from "react-select/base"
//options = vehRefOptions
//selectedValue = state.selectedVehRef.value
//selectedHistory = state.vehRefHistory

type HandleChangeFunction = (history: string) => void

interface SelectionBoxProps {
  options: { label: string; value: string }[] | undefined
  isloading: boolean
  handleChange: HandleChangeFunction // Adjust event type as needed
  selectedValue: any // Adjust type as needed
  selectedHistory: string[] // Assuming state.vehRefHistory is an array of strings
  clearSearch: (event: React.MouseEvent<HTMLButtonElement>) => void // Adjust event type as needed
}

const SelectionBox: React.FC<SelectionBoxProps> = ({ options, isloading, handleChange, selectedValue, selectedHistory, clearSearch }) => {
  const appDispatch = useContext(DispatchContext)!
  const appState = useContext(StateContext)!

  type OptionType = {
    label: string
    value: string // Adjust the value type as per your requirement
    // Add any other properties you need
  }

  // Define your custom MenuList component
  const MenuList: ComponentType<MenuListProps<OptionType>> = props => {
    const { options, children, maxHeight, getValue } = props
    // Adjustments according to your implementation
    const height = 35 // height of each option
    const value = getValue() // Adjust to call getValue safely

    const initialOffset = Array.isArray(value) ? value.indexOf(options[0]) * height : options.indexOf(value[0]) * height

    const a = React.Children.toArray(children)

    return (
      // The List component renders a virtualized list of items.
      <List height={maxHeight} itemCount={React.Children.count(children)} itemSize={height} initialScrollOffset={initialOffset} width={"auto"}>
        {({ index, style }) => <div style={style}> {a[index]}</div>}
      </List>
    )
  }

  return (
    <div>
      <p className="my-2">
        {appState.searchOption === "vehRef" ? "Vehice Ref" : appState.searchOption === "publishLine" ? "Publish Line" : "Axis Type"}: {selectedValue}
      </p>

      <Select
        components={{ MenuList }}
        menuPlacement="auto" // Automatically adjust the menu position
        maxMenuHeight={250} // Limit the maximum height of the menu to show a certain number of options
        className="  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
        options={options}
        value={selectedValue !== null ? { label: selectedValue, value: selectedValue } : null} // Use the selectedBusNumber directly
        isSearchable
        isMulti={false}
        onChange={selectedOption =>
          appState.searchOption === "vehRef"
            ? appDispatch({ type: "selectedVehRef", value: selectedOption })
            : appState.searchOption === "publishLine"
            ? appDispatch({ type: "selectedPublishLine", value: selectedOption })
            : appDispatch({ type: "selectedAxisType", value: selectedOption })
        }
        isLoading={isloading}
        isDisabled={isloading}
      />

      <div className="flex flex-row justify-center w-full mt-2 ">
        <button
          onClick={() => selectedValue && handleChange(selectedValue)}
          type="button"
          className={`
          mt-2 bg-gray-50 border border-gray-500 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
          rounded-full 
          items-center gap-2 
          
          shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
          
          transition-all
          
          hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
          hover:text-violet-500 flex-1 mr-2`}
        >
          {isloading ? (
            <div className="spin-loader"></div>
          ) : (
            <>
              <FaSearchLocation className="inline-block" />
            </>
          )}
        </button>

        {/* Switch between origninal routing  */}
        {isloading || appState.geoJson.features.length === 0 || appState.searchOption === "AxisType" ? (
          ""
        ) : (
          <div>
            <p className="mb-1 text-xs font-bold">Bus Route</p>

            <label className="switch self-center ">
              <input
                type="checkbox"
                disabled={isloading}
                checked={appState.toggleGeoJson}
                onChange={() => appDispatch({ type: "toggleGeojson", value: !appState.toggleGeoJson })}
              />
              <span className="slider"></span>
            </label>
          </div>
        )}
      </div>

      {isloading && appState.searchOption !== "AxisType" ? <ProgressBar progress={appState.progress} /> : ""}

      {selectedHistory.length === 0 ? (
        <div></div>
      ) : (
        <div className="mt-2 w-full h-full glass p-2 ">
          <h1 className="underline inline-block ">Recent Searches</h1>
          <button
            className="	 ml-2 cursor-pointer hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]"
            onClick={e => clearSearch(e)}
          >
            <FaTrash />
          </button>

          <ul>
            {selectedHistory.map((history, index) => (
              <li key={index}>
                <button
                  disabled={isloading}
                  onClick={() => {
                    handleChange(history)
                    if (appState.searchOption === "vehRef") {
                      appDispatch({ type: "selectedVehRef", value: history })
                    } else if (appState.searchOption === "Axis Type") {
                      appDispatch({ type: "selectedPublishLine", value: history })
                    } else {
                      appDispatch({ type: "selectedAxisType", value: history })
                    }
                  }}
                  className="cursor-pointer w-full block hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)] "
                >
                  <BsClockHistory className="inline-block" /> {history}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SelectionBox
