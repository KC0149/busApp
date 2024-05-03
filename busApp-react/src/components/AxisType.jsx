import React from "react"
import { FaCar, FaWalking, FaBicycle } from "react-icons/fa"

const AxisType = () => {
  return (
    <div>
      <p className="mt-2 mb-4 ">Select Axis Type</p>
      <div className=" pointer-events-auto flex divide-x divide-slate-400/20 overflow-hidden rounded-md bg-white text-[0.8125rem] text-xl leading-5 text-slate-700 shadow-sm ring-1 ring-slate-700/10">
        <div className="px-4 py-3 hover:bg-slate-50 hover:text-slate-900">
          <FaCar />
        </div>
        <div className="px-4 py-3 hover:bg-slate-50 hover:text-slate-900">
          <FaWalking />
        </div>
        <div className="px-4 py-3 hover:bg-slate-50 hover:text-slate-900">
          <FaBicycle />
        </div>
      </div>
    </div>
  )
}

export default AxisType
