"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import { SearchBar } from "@/components/ui/search-bar"
import { PropertyFilters } from "@/components/property-filters"
import { PropertyGrid } from "@/components/property-grid"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useTelegram } from "@/components/telegram-provider"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function HomeScreen() {
  const router = useRouter()
  const { webApp } = useTelegram()
  const [searchQuery, setSearchQuery] = useState("")
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("buy")

  // Mock data for properties
  const properties = [
    {
      id: "1",
      title: "Modern 2BR Apartment in Downtown",
      price: 250000,
      location: "Downtown, New York",
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 1,
      size: 85,
      image: "/placeholder.svg?height=300&width=400",
      isFavorite: false,
      listingType: "buy",
    },
    {
      id: "2",
      title: "Spacious 3BR House with Garden",
      price: 1500,
      location: "Brooklyn, New York",
      type: "House",
      bedrooms: 3,
      bathrooms: 2,
      size: 120,
      image: "/placeholder.svg?height=300&width=400",
      isFavorite: true,
      listingType: "rent",
    },
    {
      id: "3",
      title: "Luxury 1BR Studio with City View",
      price: 180000,
      location: "Manhattan, New York",
      type: "Studio",
      bedrooms: 1,
      bathrooms: 1,
      size: 55,
      image: "/placeholder.svg?height=300&width=400",
      isFavorite: false,
      listingType: "buy",
    },
    {
      id: "4",
      title: "Cozy 2BR Apartment near Park",
      price: 1200,
      location: "Queens, New York",
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 1,
      size: 75,
      image: "/placeholder.svg?height=300&width=400",
      isFavorite: false,
      listingType: "rent",
    },
  ]

  const filteredProperties = properties.filter((property) => property.listingType === activeTab)

  const handleAddProperty = () => {
    router.push("/add-property")
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto pb-16">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="p-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onFilterClick={() => setFiltersVisible(!filtersVisible)}
            />
            <div className="flex mt-4 space-x-2">
              <Button
                variant={activeTab === "buy" ? "default" : "outline"}
                onClick={() => setActiveTab("buy")}
                className={activeTab === "buy" ? "bg-[#F8F32B] text-black hover:bg-[#e9e426]" : ""}
              >
                Buy
              </Button>
              <Button
                variant={activeTab === "rent" ? "default" : "outline"}
                onClick={() => setActiveTab("rent")}
                className={activeTab === "rent" ? "bg-[#F8F32B] text-black hover:bg-[#e9e426]" : ""}
              >
                Rent
              </Button>
            </div>
          </div>
          {filtersVisible && <PropertyFilters onClose={() => setFiltersVisible(false)} />}
        </div>

        <div className="p-4">
          <PropertyGrid properties={filteredProperties} />
        </div>
      </div>

      <div className="fixed bottom-[75px] right-4 z-20">
        <Button
          className="rounded-full w-14 h-14 bg-[#F8F32B] text-black hover:bg-[#e9e426]"
          onClick={handleAddProperty}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <BottomNavigation />
    </div>
  )
}

