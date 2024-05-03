import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      target: "https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip",
      secure: false
    }
  },
  plugins: [react()]
})
