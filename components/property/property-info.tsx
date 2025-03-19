"use client"
import { Bed, Bath, Maximize } from "lucide-react"
import type { Property } from "@/types/index"

interface PropertyInfoProps {
  property: Property
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div className="flex justify-between mt-4 bg-gray-50 p-3 rounded-lg">
      <div className="flex flex-col items-center">
        <Bed className="h-5 w-5 text-gray-500" />
        <span className="text-sm mt-1">{property.bedrooms} Beds</span>
      </div>
      <div className="flex flex-col items-center">
        <Bath className="h-5 w-5 text-gray-500" />
        <span className="text-sm mt-1">{property.bathrooms} Baths</span>
      </div>
      <div className="flex flex-col items-center">
        <Maximize className="h-5 w-5 text-gray-500" />
        <span className="text-sm mt-1">{property.size} m²</span>
      </div>
    </div>
  )
}

