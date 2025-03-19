"use client"

interface PropertyAmenitiesProps {
  amenities: string[]
}

export function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {amenities.map((amenity) => (
        <div key={amenity} className="flex items-center p-2 bg-gray-50 rounded-md">
          <div className="h-2 w-2 bg-[#F8F32B] rounded-full mr-2"></div>
          <span className="text-sm">{amenity}</span>
        </div>
      ))}
    </div>
  )
}

