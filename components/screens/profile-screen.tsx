"use client"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { BottomNavigation } from "../bottom-navigation"
import { Bell, ChevronRight, Home, Plus, Search, User, X } from "lucide-react"
import { useDataContext } from "@/contexts/Data"
import Header from "../header"
import { AddPropertyScreen } from "./add-property-screen"
import { Filters, Property } from "@/types"
import { useDisplayContext } from "@/contexts/Display"
import { Switch } from "../ui/switch"
import axios from "axios"
import { PropertyFilters } from "../property-filters"
import { useState } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import EmptyScreen from "./empty-screen"

export function ProfileScreen() {
  const { setDisplay } = useDisplayContext();
  const { tgData, listings, updateProperty, isLoading } = useDataContext();

  const [openSearchAlertDialog, setOpenSearchAlertDialog] = useState<boolean>(false);


  const [filters, setFilters] = useState<Filters>({
    listingType: 'all',
    priceRange: [0, 1000000],
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    size: [0, 500],
    amenities: [],
    locality: []
  });

  // Mock data for saved searches
  // const savedSearches = [
  //   {
  //     id: "201",
  //     name: "2BR Apartments in Downtown",
  //     criteria: {
  //       type: "Apartment",
  //       bedrooms: 2,
  //       location: "Downtown",
  //       maxPrice: 300000,
  //     },
  //   },
  //   {
  //     id: "202",
  //     name: "Houses for Rent",
  //     criteria: {
  //       type: "House",
  //       listingType: "rent",
  //       maxPrice: 2000,
  //     },
  //   },
  // ]

  const savedSearches: any = [];

  const addNewProperty = () => {
    setDisplay(<AddPropertyScreen />)
  }
  const goToProperty = (property: Property) => {
    setDisplay(<AddPropertyScreen propertyData={property} />)
  }

  const handleListingVisibilityChange = async (property: Property) => {
    try {
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
                                ? `€${listing.price.toLocaleString()}`
                                : `€listing.price}/month`}
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
                <div className="w-full flex flex-col items-center">
                  <EmptyScreen
                    icon={<Home className="h-12 w-12 text-gray-300 mx-auto" />}
                    title="No Listings"
                    description="You haven't added any listings yet"
                  />
                  <Button
                    className="mt-4 bg-[#F8F32B] text-black hover:bg-[#e9e426]"
                    onClick={addNewProperty}>
                    Add New Property
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="searches" className="space-y-4">
              {savedSearches.length > 0 ? (
                savedSearches.map((search: any) => (
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
                <div className="w-full flex flex-col items-center">
                  <EmptyScreen
                    icon={<Search className="h-12 w-12 text-gray-300 mx-auto" />}
                    title="No searches Saved"
                    description="You haven't saved any searches yet"
                  />
                  <Button
                    className="mt-4 bg-[#F8F32B] text-black hover:bg-[#e9e426]"
                    onClick={() => setOpenSearchAlertDialog(true)}>
                    Add New Search
                  </Button>
                </div>
              )}
              <AlertDialog open={openSearchAlertDialog}>
                <AlertDialogTrigger asChild>
                  {
                    savedSearches.length > 0 && 
                    <Button variant="outline" size="sm" className="w-full mt-1 bg-yellow text-blue" disabled={isLoading}>
                    <Plus className="h-3 w-3 mr-1" /> Add New Search Alert
                  </Button>
                  }
                  
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[425px]">
                  <div className="overflow-auto">
                    <h1 className="text-lg text-center font-bold mb-3">Create a new search alert</h1>
                    <h2 className="text-sm text-center">You will be notified whenever a new property matching this search criteria is listed</h2>
                    <PropertyFilters alertCreation={true} initialFilters={filters} ></PropertyFilters>
                    <Button className="absolute top-4 right-4 bg-gray/10 text-blue hover:bg-gray/40 hover:text-blue" onClick={() => setOpenSearchAlertDialog(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

