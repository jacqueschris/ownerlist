"use client"
import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/types/index"
import { formatNumberWithCommas } from "@/components/lib/utils"

interface PropertyHeaderProps {
  property: Property
}

export function PropertyHeader({ property }: PropertyHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-xl font-bold">{property.title}</h1>
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.location}</span>
        </div>
        <Badge className="bg-blue text-yellow py-2 px-5 mt-2">{property.propertyType.toUpperCase()}</Badge>
      </div>
      <div className="text-2xl font-bold">
        {property.listingType === "buy"
          ? `€${formatNumberWithCommas(property.price)}`
          : `€${formatNumberWithCommas(property.price)}/month`}
      </div>
    </div>
  )
}

