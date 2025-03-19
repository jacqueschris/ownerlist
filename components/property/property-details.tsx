"use client"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { Property } from "@/types/index"
import MapWrapper from "@/components/ui/map-wrapper"

interface PropertyDetailsProps {
  property: Property
  openGoogleMaps: () => void
}

export function PropertyDetails({ property, openGoogleMaps }: PropertyDetailsProps) {
  return (
    <>
      <div>
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-sm text-gray-600">{property.description}</p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Location</h3>
        <div className="relative h-40 w-full rounded-lg overflow-hidden mb-2">
          <MapWrapper draggable={false} position={[property.position[0], property.position[1]]} />
        </div>
        <Button variant="outline" className="w-full text-[#2B2D42]" onClick={openGoogleMaps}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in Google Maps
        </Button>
      </div>
    </>
  )
}

