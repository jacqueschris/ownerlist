"use client"
import { Bed, Bath, Maximize, Car } from "lucide-react"
import type { Property } from "@/types/index"

interface PropertyInfoProps {
  property: Property
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  let carSpaces = 0

  if(property.carSpaces){
    for (let carSpace of property.carSpaces) {
      carSpaces = carSpaces + carSpace.capacity
    }
  }
  
  return (
    <div className="grid grid-cols-4 gap-4 mt-4 bg-gray-50 p-3 rounded-lg">
      {property.propertyType != "garage" && property.propertyType != "shop" &&
        <div className="flex flex-col items-center">
          <Bed className="h-5 w-5 text-gray-500" />
          <span className="text-sm mt-1">{property.bedrooms} Beds</span>
        </div>}
      {property.propertyType != "garage" &&
        <div className="flex flex-col items-center">
          <Bath className="h-5 w-5 text-gray-500" />
          <span className="text-sm mt-1">{property.bathrooms} Baths</span>
        </div>}
      <div className="flex flex-col items-center">
        <Car className="h-5 w-5 text-gray-500" />
        <span className="text-sm mt-1">{carSpaces} Car Capacity</span>
      </div>
      <div className="flex flex-col items-center">
        <Maximize className="h-5 w-5 text-gray-500" />
        <span className="text-sm mt-1">{property.size} m²</span>
      </div>
    </div>
  )
}

