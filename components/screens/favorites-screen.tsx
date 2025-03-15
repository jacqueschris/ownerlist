"use client"
import { PropertyGrid } from "../property-grid"
import { BottomNavigation } from "../bottom-navigation"
import { useTelegram } from "../telegram-provider"

export function FavoritesScreen() {
  const { webApp } = useTelegram()

  // Mock data for favorite properties
  const favoriteProperties = [
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
      id: "5",
      title: "Luxury Penthouse with Terrace",
      price: 450000,
      location: "Manhattan, New York",
      type: "Penthouse",
      bedrooms: 3,
      bathrooms: 2,
      size: 150,
      image: "/placeholder.svg?height=300&width=400",
      isFavorite: true,
      listingType: "buy",
    },
  ]

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto pb-16">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Favorites</h1>
        </div>

        <div className="p-4">
          {favoriteProperties.length > 0 ? (
            <PropertyGrid properties={favoriteProperties} />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No favorite properties yet</p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

