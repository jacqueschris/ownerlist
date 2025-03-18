"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Calendar } from "../ui/calendar"
import { useTelegram } from "../telegram-provider"
import {
  ArrowLeft,
  Heart,
  MapPin,
  Share2,
  Bed,
  Bath,
  Maximize,
  CalendarIcon,
  MessageCircle,
  ExternalLink,
} from "lucide-react"
import { HomeScreen } from "./home-screen"
import { useDisplayContext } from "@/contexts/Display"
import { formatNumberWithCommas } from "@/components/lib/utils"
import MapWrapper from "../ui/map-wrapper"
import { Badge } from "../ui/badge"
import { Property } from "@/types"

interface PropertyDetailProps {
  property: Property
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const { webApp } = useTelegram()
  const { setDisplay } = useDisplayContext()
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(-1)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | null>(null)

  useEffect(() => {
    if (webApp) {
      webApp.BackButton.show()
      webApp.BackButton.onClick(() => setDisplay(<HomeScreen />))
    }

    return () => {
      if (webApp) {
        webApp.BackButton.hide()
        webApp.BackButton.offClick(() => setDisplay(<HomeScreen />))
      }
    }
  }, [webApp])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  // Replace the getAvailableTimeSlots function with this version
  const getAvailableTimeSlots = (selectedDate: Date | undefined) => {
    if (!selectedDate || !property.availabilitySchedule) return []

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const dayOfWeek = daysOfWeek[selectedDate.getDay()]

    const availabilityForDay = property.availabilitySchedule.find((availability) => availability.day === dayOfWeek)

    return availabilityForDay?.timeSlots || []
  }

  const handleBookViewing = () => {
    if (!date || !selectedTimeSlot) return

    // Handle booking logic
    alert(`Viewing requested for ${date.toDateString()} from ${selectedTimeSlot.start} to ${selectedTimeSlot.end}`)
  }

  const openGoogleMaps = () => {
    console.log(`https://www.google.com/maps/search/?api=1&query=${property.position[0]}%2C${property.position[1]}`)
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${property.position[0]}%2C${property.position[1]}`,
      "_blank",
    )
  }

  return (
    <div className="pb-16">
      {/* Image Gallery */}
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
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm"
              onClick={() => setDisplay(<HomeScreen />)}
            >
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

      {/* Property Details */}
      <div className="p-4">
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

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
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
          </TabsContent>
          <TabsContent value="amenities">
            <div className="grid grid-cols-2 gap-2">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center p-2 bg-gray-50 rounded-md">
                  <div className="h-2 w-2 bg-[#F8F32B] rounded-full mr-2"></div>
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="contact">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Owner Information</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {property.owner.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Username:</span> {`@${property.owner.username}`}
                  </p>
                </div>
                <Button className="w-full mt-4 bg-[#F8F32B] text-black hover:bg-[#e9e426]">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Owner
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h3 className="font-semibold mb-4">Book a Viewing</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              setSelectedTimeSlot(null) // Reset time slot when date changes
            }}
            className="rounded-md border "
            // Update the Calendar's disabled function
            disabled={(date) => {
              if (!property.availabilitySchedule) return false

              const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
              const dayOfWeek = daysOfWeek[date.getDay()]

              return !property.availabilitySchedule.some((availability) => availability.day === dayOfWeek)
            }}
          />

          {date && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Available Time Slots</h4>
              <div className="grid grid-cols-2 gap-2">
                {getAvailableTimeSlots(date).length > 0 ? (
                  getAvailableTimeSlots(date).map((slot, index) => (
                    <Button
                      key={index}
                      variant={selectedTimeSlot === slot ? "default" : "outline"}
                      className={`text-sm ${selectedTimeSlot === slot ? "bg-blue text-yellow hover:text-white" : ""}`}
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {slot.start} - {slot.end}
                    </Button>
                  ))
                ) : (
                  <p className="col-span-2 text-sm text-gray-500">No time slots available for this date.</p>
                )}
              </div>
            </div>
          )}

          <Button
            className="w-full mt-4 bg-[#F8F32B] text-black hover:bg-[#e9e426]"
            disabled={!date || !selectedTimeSlot}
            onClick={handleBookViewing}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Request Viewing
          </Button>
        </div>
      </div>
    </div>
  )
}

