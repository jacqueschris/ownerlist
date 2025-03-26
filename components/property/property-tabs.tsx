"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import type { Property } from "@/types/index"
import { PropertyDetails } from "./property-details"
import { PropertyAmenities } from "./property-amenities"

interface PropertyTabsProps {
  property: Property
}

export function PropertyTabs({ property }: PropertyTabsProps) {
  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${property.position[0]}%2C${property.position[1]}`,
      "_blank",
    )
  }

  return (
    <Tabs defaultValue="details" className="mt-6">
      <TabsList className={`grid grid-cols-${property.amenities.length > 0 ? 3 : 2} mb-4`}>
        <TabsTrigger value="details">Details</TabsTrigger>
        {property.amenities.length > 0 && (
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
        )}
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="space-y-4">
        <PropertyDetails property={property} openGoogleMaps={openGoogleMaps} />
      </TabsContent>

      {property.amenities.length > 0 && (
        <TabsContent value="amenities">
          <PropertyAmenities amenities={property.amenities} />
        </TabsContent>
      )
      }

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
  )
}

