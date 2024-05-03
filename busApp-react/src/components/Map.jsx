import React, { useContext, useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, useMap, Marker, Popup, GeoJSON, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "../App.css"
import Info from "./Info"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import axios from "axios"
import { toast } from "react-toastify"

function Map({ geojson, setisLoading }) {
  const [center, setCenter] = useState([40.689916, -73.930448])
  const key = JSON.stringify(geojson) // need the key to rerender the map
  const mapRef = useRef(null)
  const previousGeoJSONLayer = useRef(null)
  const [allProperties, setAllProperties] = useState([])
  const geojsonLayerRef = useRef(null)

  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  //inital useEffect to show route on map
  useEffect(() => {
    setAllProperties([])
    // Calculate the center based on the new GeoJSON data
    const calculateCenter = () => {
      if (geojson && geojson.features && geojson.features.length > 0) {
        const bounds = L.geoJSON(geojson).getBounds() //L refers to the global Leaflet namespace

        return bounds.getCenter()
      } else {
        return [40.689916, -73.930448] // Default center if no GeoJSON data or features
      }
    }

    // Update the center when the GeoJSON prop changes
    setCenter(calculateCenter())
    // Zoom map to fit the bounds of the GeoJSON data
    if (!appState.toggleGeoJson) {
      const bounds = L.geoJSON(geojson).getBounds()
      if (bounds) {
        mapRef.current?.flyToBounds(bounds)
      }
    }
    // get all the properties inside the geojson
    const layerGroup = L.geoJSON(geojson, {
      onEachFeature: function (feature, layer) {
        // Store properties of the current feature
        setAllProperties(prevProperties => [...prevProperties, feature.properties])
      }
    })
  }, [geojson])

  //for bus routing
  useEffect(() => {
    if (!appState.toggleGeoJson && geojson && appState.runBusRouting) {
      setisLoading(true) //set loading to disable toggles
      appDispatch({ type: "runBusRouting", value: false }) //to prevent useEffect from running again. only True when search button is pressed
      console.log(geojson)
      console.log(allProperties)

      // Loop through each feature
      const geometries = []
      geojson.features.forEach((feature, index) => {
        const featureMap = {}
        if (feature.geometry.type === "LineString") {
          // Extract coordinates from the geometry
          const coordinates = feature.geometry.coordinates
          // Iterate over each coordinate pair
          coordinates.forEach((coordinate, pointIndex) => {
            // Create an object with properties pointX, long, and lat
            const geometryDict = {
              point: pointIndex + 1, // Point index starts from 1
              long: coordinate[0],
              lat: coordinate[1],
              PublishedLineName: feature.properties.PublishedLineName // Assuming you want to include the PublishedLineName property
            }
            // Push the dictionary into the array
            featureMap[pointIndex] = geometryDict
          })
          geometries.push(featureMap)
        }
      })

      console.log("2. Extract Points values: ", geometries) //array which contains a dictonary of {point geom : [mylatlong]}

      async function busRouting() {
        try {
          // Initialize an array to store individual GeoJSON responses
          const individualResponses = []

          let totalIterations = 0
          for (const key in geometries) {
            if (geometries.hasOwnProperty(key)) {
              const pointsArray = geometries[key] // Get the array of points for the current key
              console.log(pointsArray)
              const eachIteration = Object.keys(pointsArray).length - 1

              totalIterations += eachIteration
            }
          }
          console.log("totalIterations:", totalIterations)

          let currentIteration = 0
          // Iterate over each key in the dictionary
          for (const key in geometries) {
            if (geometries.hasOwnProperty(key)) {
              const pointsArray = geometries[key] // Get the array of points for the current key
              console.log("3. Points array for new key: ", pointsArray) //{ {points: },{points: },{points: } }

              // Iterate over each point in the array ( point 1-2 , 2-3, 3-4)
              for (let i = 0; i < Object.keys(pointsArray).length - 1; i++) {
                //first point
                const startPoint = pointsArray[i]

                //following point
                const endPoint = pointsArray[i + 1]

                // Create payload for POST request from start and end point extract long lat
                const payload = {
                  startPt: {
                    long: startPoint.long,
                    lat: startPoint.lat
                  },
                  endPt: {
                    long: endPoint.long,
                    lat: endPoint.lat
                  }
                }
                console.log("payload", payload)

                // Make POST request
                try {
                  let response = null
                  while (response === null || response.data === "wait") {
                    response = await axios.post("https://nyc-bus-routing-k3q4yvzczq-an.a.run.app/route", payload)
                    console.log(response)
                    if (response.data !== "wait") {
                      if (i === 0 && Object.keys(pointsArray).length === 2) {
                        response.data.features = response.data.features.filter(feature => {
                          const isStartPoint = feature.properties["point type"] === "closest start"

                          const isClosestGoalPoint = feature.properties["point type"] === "closest goal"
                          const isLineString = feature.geometry.type === "LineString"
                          return isClosestGoalPoint || isLineString || isStartPoint
                        })
                      } else if (i === 0) {
                        response.data.features = response.data.features.filter(feature => {
                          const isStartPoint = feature.properties["point type"] === "closest start"
                          const isLineString = feature.geometry.type === "LineString"
                          return isStartPoint || isLineString
                        })
                      } else if (i === Object.keys(pointsArray).length - 2) {
                        response.data.features = response.data.features.filter(feature => {
                          const isClosestGoalPoint = feature.properties["point type"] === "closest goal"
                          const isLineString = feature.geometry.type === "LineString"
                          return isClosestGoalPoint || isLineString
                        })
                      } else {
                        response.data.features = response.data.features.filter(feature => feature.geometry.type === "LineString")
                      }
                      console.log(response.data.features)
                      individualResponses.push(response.data)
                      currentIteration++

                      // Calculate percentage progress
                      const progress = ((currentIteration / totalIterations) * 100).toFixed(0)
                      console.log("Progress:", progress + "%")
                      appDispatch({ type: "updateProgress", value: progress })
                    }
                  }
                } catch (error) {
                  console.log("There was a problem.", error)
                  toast.error(`There was an error, reload page.`, {
                    position: "top-left"
                  })
                }
              }
            }
          }

          // Combine individual GeoJSON responses into one GeoJSON object (The reduce function is used to transform an array into a single value.)
          const combinedFeatures = individualResponses.reduce((acc, cur) => acc.concat(cur.features), [])
          console.log("4. Combine Features : ", combinedFeatures)
          const combinedGeoJSON = {
            type: "FeatureCollection",
            features: combinedFeatures
          }

          // Now combinedGeoJSON contains all features from the responses combined into one GeoJSON object
          console.log("5. Combine GeoJson: ", combinedGeoJSON)

          let closestStartCount = 0
          let closestGoalCount = 0

          combinedFeatures.forEach(feature => {
            if (feature.properties && feature.properties["point type"]) {
              if (feature.properties["point type"] === "closest start") {
                closestStartCount++
              } else if (feature.properties["point type"] === "closest goal") {
                closestGoalCount++
              }
            }
          })

          console.log("Number of closest start:", closestStartCount)
          console.log("Number of closest goal:", closestGoalCount)

          appDispatch({ type: "combineGeojson", value: combinedGeoJSON })

          setisLoading(false)
          appDispatch({ type: "updateProgress", value: 0 })
        } catch (e) {
          console.log("There was a problem.", e)
          toast.error(`There was an error, reload page.`, {
            position: "top-left"
          })
          setisLoading(false)
        }
      }

      // Call the busRouting function
      busRouting()
    }
  }, [appState.runBusRouting && geojson])

  function MyPopup({ geojson }) {
    const map = useMap()

    if (map && previousGeoJSONLayer.current) {
      map.removeLayer(previousGeoJSONLayer.current)
    }

    // //set path to red when clicked
    // useEffect(() => {
    //   if (appState.infoVisible === true) {
    //     if (previousGeoJSONLayer.current && appState.featureProperties) {
    //       previousGeoJSONLayer.current.eachLayer(layer => {
    //         if (layer.setStyle) {
    //           // Check if the layer has a setStyle method
    //           const layerProperties = layer.feature.properties
    //           const featureProperties = appState.featureProperties
    //           // Check if layer properties match feature properties
    //           const propertiesMatch = JSON.stringify(layerProperties) === JSON.stringify(featureProperties)
    //           if (propertiesMatch) {
    //             layer.setStyle({ color: "red" })
    //           }
    //         } else if (layer instanceof L.Marker) {
    //           // Check if the layer is a Marker instance
    //           // const layerProperties = layer.feature.properties
    //           // const featureProperties = appState.featureProperties
    //           // // Check if layer properties match feature properties
    //           // const propertiesMatch = JSON.stringify(layerProperties) === JSON.stringify(featureProperties)
    //           // if (propertiesMatch) {
    //           //   layer._icon?.classList.add("huechange")
    //           // }
    //           // layer.on("click", function () {
    //           //   // Toggle the highlighting class when the marker is clicked
    //           //   this._icon?.classList.add("huechange")

    //           // })
    //           changeMakerColor(layer)
    //         }
    //       })
    //     }
    //   }
    // }, [appState.infoVisible])

    //reset path to blue when info closes

    useEffect(() => {
      if (!appState.infoVisible) {
        previousGeoJSONLayer.current.eachLayer(layer => {
          if (layer.setStyle) {
            layer.setStyle({ color: "#3388ff" })
          } else if (layer instanceof L.Marker) {
            layer._icon?.classList.remove("huechange")
          }
        })
      }
    }, [appState.infoVisible])

    var layerGroup = L.geoJSON(geojson, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(() => {
          return "<h1>" + layer.feature.properties?.VehicleRef + "</h1>"

          function colorLayer(layer) {
            console.log(layer)
            const clickedProperties = layer.feature.properties

            // Dispatch an action to set the feature properties
            appDispatch({ type: "updateProperties", value: clickedProperties })

            appDispatch({ type: "toggleInfo", value: true })
            // if (layer instanceof L.Marker) {
            //   console.log("color")
            layer._icon.classList.add("huechange")

            appDispatch({ type: "selectedLayer", value: layer })

            //   layer.setStyle({ color: "red" })
          }
        })
      }
    }).addTo(map)
    // Save a reference to the new GeoJSON layer
    previousGeoJSONLayer.current = layerGroup
  }

  let prevLayer = null

  //set route coloring when clicked
  function colorLayer(layer) {
    //reset previous selected color
    if (prevLayer) {
      if (prevLayer instanceof L.Marker) {
        prevLayer._icon?.classList.remove("huechange")
      } else {
        prevLayer.setStyle({ color: "#3388ff" })
      }
    }

    const clickedProperties = layer.feature.properties

    // Dispatch an action to set the feature properties
    appDispatch({ type: "updateProperties", value: clickedProperties })
    // Dispatch to open info
    appDispatch({ type: "toggleInfo", value: true })

    //set color of current layer
    if (layer) {
      console.log(layer)

      if (layer.setStyle) {
        layer.setStyle({ color: "red" })
      } else if (layer instanceof L.Marker) {
        layer._icon?.classList.add("huechange")
      }
    }

    prevLayer = layer
  }

  //reset color when info panel is closed
  useEffect(() => {
    if (!appState.infoVisible) {
      geojsonLayerRef.current?.eachLayer(layer => {
        if (layer.setStyle) {
          layer.setStyle({ color: "#3388ff" })
        } else if (layer instanceof L.Marker) {
          layer._icon?.classList.remove("huechange")
        }
      })
    }
  }, [appState.infoVisible])

  return (
    <div className="relative" style={{ width: "100%", height: "100%", position: "unset" }}>
      <MapContainer ref={mapRef} center={center} zoom={10} scrollWheelZoom={true} animate={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON
          ref={geojsonLayerRef}
          key={key}
          data={geojson}
          onEachFeature={function (feature, layer) {
            layer.on("click", e => {
              colorLayer(layer)
            })
          }}
        />
        {/* <MyPopup geojson={geojson} /> */}
      </MapContainer>
      <Info />
    </div>
  )
}

export default Map

//key prop can be used on any component regardless
//what is the key use for map container
//Enters the key prop: it helps React identifying a component but it also can be used to tell React that the
// component identity has changed, forcing a full re-instantiation of that component
