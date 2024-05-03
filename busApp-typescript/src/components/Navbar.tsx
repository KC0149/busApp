import React, { useContext } from "react"
import busLogo from "../assets/bus.svg"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

interface NavbarProps {
  isloading: boolean
}

const Navbar: React.FC<NavbarProps> = ({ isloading }) => {
  const appDispatch = useContext(DispatchContext)!
  const appState = useContext(StateContext)!

  return (
    <div className="glass  w-10/12 flex flex-wrap items-center justify-between mx-auto p-3 transition fixed z-[999]  ">
      <a href="/">
        <img src={busLogo} className="logo ml-5" alt="Vite logo" />
      </a>

      <div className="radio-inputs">
        <label className="radio">
          <input
            disabled={isloading}
            type="radio"
            name="radio"
            id="vehical ref"
            checked={appState.searchOption === "vehRef"}
            onChange={e => {
              appDispatch({ type: "toggleSelection", value: "vehRef" })
              // Dispatch the second action to toggle the taskbar cross button
              appDispatch({ type: "taskbar", value: true })
            }}
          ></input>
          <span className="name">Vehical Ref</span>
        </label>
        <label className="radio">
          <input
            disabled={isloading}
            type="radio"
            name="radio"
            checked={appState.searchOption === "publishLine"}
            onChange={e => {
              appDispatch({ type: "toggleSelection", value: "publishLine" })
              // Dispatch the second action to toggle the taskbar cross button
              appDispatch({ type: "taskbar", value: true })
            }}
          ></input>
          <span className="name">Publish Line</span>
        </label>
        <label className="radio">
          <input
            disabled={isloading}
            type="radio"
            name="radio"
            checked={appState.searchOption === "AxisType"}
            onChange={e => {
              appDispatch({ type: "toggleSelection", value: "AxisType" })
              // Dispatch the second action to toggle the taskbar cross button
              appDispatch({ type: "taskbar", value: true })
            }}
          ></input>
          <span className="name">Road Type</span>
        </label>
      </div>

      <label className="flex text-2xl black items-center cursor-pointer  bar ">
        <input
          type="checkbox"
          id="check"
          checked={appState.isChecked}
          onChange={e => appDispatch({ type: "taskbar", value: appState.isChecked ? false : true })}
        />

        <span className="top"></span>
        <span className="middle"></span>
        <span className="bottom"></span>
      </label>
    </div>
  )
}

export default Navbar
