"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Share2 } from "lucide-react"
import type { Property } from "@/types/index"

interface PropertyGalleryProps {
  property: Property
  activeImageIndex: number
  setActiveImageIndex: (index: number) => void
  isFavorite: boolean
  toggleFavorite: () => void
  goBack: () => void
}

export function PropertyGallery({
  property,
  activeImageIndex,
  setActiveImageIndex,
  isFavorite,
  toggleFavorite,
  goBack,
}: PropertyGalleryProps) {
  return (
    <div className="relative">
      <div className="relative h-64 w-full bg-[#dde1e8]">
        <Image
          src={
            activeImageIndex > -1 ? property.images[activeImageIndex] : `/${property.propertyType.toLowerCase()}.png`
          }
          alt={property.title}
          fill
          className="object-contain"
        />
        <div className="absolute top-4 left-4 z-10">
          <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm" onClick={goBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm"
            onClick={toggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex overflow-x-auto p-2 space-x-2 bg-white">
        {property.images.map((image, index) => (
          <button
            key={index}
            className={`flex-shrink-0 ${activeImageIndex === index ? "ring-2 ring-[#F8F32B]" : ""}`}
            onClick={() => setActiveImageIndex(index)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              width={60}
              height={60}
              className="object-cover rounded-md h-16 w-16"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

