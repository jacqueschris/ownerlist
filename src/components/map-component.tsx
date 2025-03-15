"use client"

import { useRef } from "react"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet marker icon issue
const DefaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// Draggable marker component
function DraggableMarker({
  position,
  setPosition,
}: {
  position: [number, number]
  setPosition: (pos: [number, number]) => void
}) {
  const markerRef = useRef<L.Marker>(null)

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current
      if (marker != null) {
        const newPos = marker.getLatLng()
        setPosition([newPos.lat, newPos.lng])
      }
    },
  }

  return (
    <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef} icon={DefaultIcon} />
  )
}

// Search location component
function LocationSearch({ setPosition }: { setPosition: (pos: [number, number]) => void }) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

interface MapComponentProps {
  position: [number, number]
  setPosition: (pos: [number, number]) => void
}

export default function MapComponent({ position, setPosition }: MapComponentProps) {
  useEffect(() => {
    // Fix for Leaflet marker icons in Next.js
    L.Marker.prototype.options.icon = DefaultIcon
  }, [])

  return (
    <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker position={position} setPosition={setPosition} />
      <LocationSearch setPosition={setPosition} />
    </MapContainer>
  )
}

