import React from "react"

interface progressProp {
  progress: string
}

const ProgressBar: React.FC<progressProp> = ({ progress }) => {
  return (
    <>
      <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mt-3 border border-gray-900">
        <div
          className={`bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full  transition-width duration-500`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <h1>Loading: {progress}%</h1>
    </>
  )
}

export default ProgressBar
