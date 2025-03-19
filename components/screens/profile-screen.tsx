"use client"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { BottomNavigation } from "../bottom-navigation"
import { Bell, ChevronRight, Home, User } from "lucide-react"
import Link from "next/link"
import { useDataContext } from "@/contexts/Data"
import Header from "../header"
import { AddPropertyScreen } from "./add-property-screen"
import { Property } from "@/types"
import { useDisplayContext } from "@/contexts/Display"
import { Switch } from "../ui/switch"
import axios from "axios"

export function ProfileScreen() {
  const {setDisplay} = useDisplayContext();
  const {tgData, listings, updateProperty} = useDataContext();

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

  
  const addNewProperty = () => {
    setDisplay(<AddPropertyScreen />)
  }
  const goToProperty = (property: Property) => {
    setDisplay(<AddPropertyScreen propertyData={property} />)
  }

  const handleListingVisibilityChange = async (property: Property) => {
    try{
      let response = await axios.post('api/property/visibility', {
        active: !property.active,
        token: window.Telegram.WebApp.initData,
        id: property.id,
      });

      if (response.status === 200) {
        let newProperty = property
        newProperty.active = !property.active
        updateProperty(newProperty)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto pb-16">
      <Header title="Profile"></Header>

        <div className="p-4">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div className="ml-4">
                  <h2 className="font-bold text-lg">
                    {tgData.user?.first_name || "User"} {tgData.user?.last_name || ""}
                  </h2>
                  <p className="text-gray-500 text-sm">@{tgData.user?.username || "username"}</p>
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
              {listings && listings.length > 0 ? (
                listings.map((listing, index) => (
                    <Card key={index}>
                      <CardContent className="p-0">
                        <div className="flex items-center p-4">
                          <div className="w-[100px] h-[100px] rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={`${listing.propertyType.toLowerCase()}.png`}
                              alt={listing.title}
                              className="w-full h-full object-contain"
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
                            </div>
                            <div className="flex mt-3">
                              <label className="mr-3">Active: </label>
                            <Switch checked={listing.active} onCheckedChange={() => handleListingVisibilityChange(listing)}></Switch>

                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" onClick={() => goToProperty(listing)} />
                        </div>
                      </CardContent>
                    </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't added any listings yet</p>
                </div>
              )}

              <Button className="w-full bg-[#F8F32B] text-black hover:bg-[#e9e426]" onClick={addNewProperty}>
                Add New Property
              </Button>
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
              <Button className="mt-4 bg-[#F8F32B] text-black hover:bg-[#e9e426] w-full" asChild>
                    <Link href="/add-search-alert">Add New Search Alert</Link>
                  </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

