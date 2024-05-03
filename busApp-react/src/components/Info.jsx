import React, { useContext, useEffect, useState } from "react"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

const Info = () => {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  return (
    <div
      className={` glass left-0 top-0  py-7  z-[999] px-5 items-center  max-w-[30%] ease-in-out duration-300 absolute overflow-y-scroll h-full
      transition-all ${appState.infoVisible ? "translate-x-0" : "translate-x-[-100%] !important"}`}
    >
      <div className="  w-full">
        <button
          type="button"
          className=" flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 
             bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700 mb-5 ml-auto"
          onClick={e => appDispatch({ type: "toggleInfo", value: false })}
        >
          <svg className="w-5 h-5 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
          </svg>
        </button>
      </div>
      <div>
        <table className="table-fixed text-[0.7em]">
          <tbody>
            {appState.featureProperties &&
              Object.entries(appState.featureProperties).map(([key, value], index) => (
                <tr className="border border-gray-900" key={`${key}-${index}`}>
                  <td className="border border-gray-900">{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Info
