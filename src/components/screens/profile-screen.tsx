"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useTelegram } from "@/components/telegram-provider"
import { Bell, ChevronRight, Home, User } from "lucide-react"
import Link from "next/link"

export function ProfileScreen() {
  const { user } = useTelegram()

  // Mock data for user's listings
  const myListings = [
    {
      id: "101",
      title: "Modern Studio in City Center",
      price: 1200,
      location: "Manhattan, New York",
      type: "Studio",
      image: "/placeholder.svg?height=300&width=400",
      listingType: "rent",
      status: "active",
    },
    {
      id: "102",
      title: "Family House with Garden",
      price: 350000,
      location: "Queens, New York",
      type: "House",
      image: "/placeholder.svg?height=300&width=400",
      listingType: "buy",
      status: "active",
    },
  ]

  // Mock data for saved searches
  const savedSearches = [
    {
      id: "201",
      name: "2BR Apartments in Downtown",
      criteria: {
        type: "Apartment",
        bedrooms: 2,
        location: "Downtown",
        maxPrice: 300000,
      },
    },
    {
      id: "202",
      name: "Houses for Rent",
      criteria: {
        type: "House",
        listingType: "rent",
        maxPrice: 2000,
      },
    },
  ]

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto pb-16">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Profile</h1>
        </div>

        <div className="p-4">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div className="ml-4">
                  <h2 className="font-bold text-lg">
                    {user?.first_name || "User"} {user?.last_name || ""}
                  </h2>
                  <p className="text-gray-500 text-sm">@{user?.username || "username"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="listings">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="searches">Saved Searches</TabsTrigger>
            </TabsList>

            <TabsContent value="listings" className="space-y-4">
              {myListings.length > 0 ? (
                myListings.map((listing) => (
                  <Link href={`/property/${listing.id}`} key={listing.id}>
                    <Card>
                      <CardContent className="p-0">
                        <div className="flex items-center p-4">
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={listing.image || "/placeholder.svg"}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="font-medium">{listing.title}</h3>
                            <p className="text-sm text-gray-500">{listing.location}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="font-bold">
                                {listing.listingType === "buy"
                                  ? `$${listing.price.toLocaleString()}`
                                  : `$${listing.price}/month`}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  listing.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {listing.status === "active" ? "Active" : "On Hold"}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center py-10">
                  <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't added any listings yet</p>
                  <Button className="mt-4 bg-[#F8F32B] text-black hover:bg-[#e9e426]" asChild>
                    <Link href="/add-property">Add Property</Link>
                  </Button>
                </div>
              )}

              {myListings.length > 0 && (
                <Button className="w-full bg-[#F8F32B] text-black hover:bg-[#e9e426]" asChild>
                  <Link href="/add-property">Add New Property</Link>
                </Button>
              )}
            </TabsContent>

            <TabsContent value="searches" className="space-y-4">
              {savedSearches.length > 0 ? (
                savedSearches.map((search) => (
                  <Card key={search.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{search.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {Object.entries(search.criteria)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")}
                          </p>
                        </div>
                        <Bell className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No saved searches yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

