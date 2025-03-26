"use client"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { BottomNavigation } from "../bottom-navigation"
import { Bell, ChevronDown, ChevronRight, ChevronUp, Eye, Home, LoaderCircle, Plus, Search, Trash, User, Volume2, VolumeOff, X } from "lucide-react"
import { useDataContext } from "@/contexts/Data"
import Header from "../header"
import { AddPropertyScreen } from "./add-property-screen"
import { Filters, Property, SearchAlert } from "@/types"
import { useDisplayContext } from "@/contexts/Display"
import { Switch } from "../ui/switch"
import axios from "axios"
import { PropertyFilters } from "../property-filters"
import { useState } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import EmptyScreen from "./empty-screen"
import { toast } from "../ui/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion"
import { Badge } from "../ui/badge"
import { capitalizeFirstLetter, formatNumberWithCommas } from "../lib/utils"
import { HomeScreen } from "./home-screen"

export function ProfileScreen() {
  const { setDisplay } = useDisplayContext();
  const { tgData, listings, updateProperty, isLoading, addSearchAlert, searchAlerts, updateSearchAlert, deleteSearchAlert } = useDataContext();

  const [openSearchAlertDialog, setOpenSearchAlertDialog] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    listingType: 'all',
    priceRange: [0, 100000000],
    propertyType: [],
    garageSpaces: '',
    bedrooms: '',
    bathrooms: '',
    size: [0, 10000],
    amenities: [],
    locality: []
  });

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

  const handleCreateSearchAlert = async (newFilters: Filters, searchAlertName?: string) => {
    try {
      let res = await axios.post(`/api/alert/create`, { token: window.Telegram.WebApp.initData, filters: newFilters, name: searchAlertName });
      debugger
      if (res.status === 200 && res.data.search) {
        addSearchAlert(res.data.search);
        toast({
          title: 'Search Alert Created',
          description: 'The search alert was created successfully',
          variant: 'default',
        });
      } else {
        console.error('Error creating alert:', res.data);
        toast({
          title: 'Your search alert was not created',
          description: 'The search alert was not created successfully, please try again',
          variant: 'destructive',
        });
      }
      setOpenSearchAlertDialog(false);
    } catch (error) {
      console.error(error);
    }
  }

  const toggleAlert = async (alertId: string, active: boolean) => {
    try {
      let res = await axios.patch(`/api/alert/toggle`, { token: window.Telegram.WebApp.initData, searchId: alertId, active: active });
      if (res.status === 200) {
        let newSearchAlert = searchAlerts?.find((searchAlert: SearchAlert) => searchAlert.id == alertId)
        newSearchAlert!.active = active
        updateSearchAlert(newSearchAlert!);
        toast({
          title: active ? 'Search Alert Turned On' : 'Search Alert Turned Off',
          description: active ? 'The search alert was turned on successfully' : 'The search alert was turned off successfully',
          variant: 'default',
        });
      } else {
        console.error('Error toggling alert:', res.data);
        toast({
          title: active ? 'Your search alert was not turned on' : 'Your search alert was not turned off',
          description: active ? 'The search alert was not turned on successfully, please try again' : 'The search alert was not turned off successfully, please try again',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const deleteAlert = async (alertId: string) => {
    try {
      const res = await axios.delete('/api/alert/delete', {
        data: {
          token: window.Telegram.WebApp.initData,
          searchId: alertId,
        },
      });
      if (res.status === 200) {
        deleteSearchAlert(alertId);
        toast({
          title: 'Search Alert Deleted',
          description: 'The search alert was deleted successfully',
          variant: 'default',
        });
      } else {
        console.error('Error deleting alert:', res.data);
        toast({
          title: 'Your search alert was not deleted',
          description: 'The search alert was not deleted successfully, please try again',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-auto pb-16">
          <Header title="Profile" />

          <div className="p-4">
            <EmptyScreen
              icon={<LoaderCircle className="loader-circle h-6 w-6 text-muted-foreground" />}
              title="Loading..."
              description="Please be patient while we load your data"
            />
          </div>
          <BottomNavigation />
        </div>
      </div>
    );

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
                          <p className="text-sm text-gray-500 mt-2">{`Active until: ${new Date(listing.activeUntil*1000).toLocaleString()}`}</p>
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
              {searchAlerts.length > 0 ? (
                <Accordion type="single" collapsible value={openAlert ?? undefined}
                  onValueChange={(val) => setOpenAlert(val || null)}>
                  {searchAlerts.map((search: SearchAlert) => (
                    <Card key={search.id}>
                      <CardContent className="p-4">
                        <AccordionItem value={search.id}>

                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{search.name}</h3>
                            </div>
                            <div className="flex">
                              <div className="p-3 rounded-full hover:bg-gray/30 cursor-pointer rounded-full hover:bg-gray/30">
                                  <Eye className="h-5 w-5 text-gray-400" onClick={() => setDisplay(<HomeScreen initialFilters={search.filters} />)} />
                              </div>
                              <div className="p-3 rounded-full hover:bg-gray/30 cursor-pointer rounded-full hover:bg-gray/30">
                                {search.active ? <VolumeOff className="h-5 w-5 text-gray-400" onClick={() => toggleAlert(search.id, false)} /> :
                                  <Volume2 className="h-5 w-5 text-gray-400" onClick={() => toggleAlert(search.id, true)} />}
                              </div>
                              <div className="p-3 rounded-full hover:bg-gray/30 cursor-pointer rounded-full hover:bg-gray/30">
                                <Trash className="h-5 w-5 text-gray-400" onClick={() => deleteAlert(search.id)} />
                              </div>
                              <div className="p-3 rounded-full hover:bg-gray/30 cursor-pointer">
                                {openAlert === search.id ? <ChevronUp onClick={() => setOpenAlert(null)} /> : <ChevronDown onClick={() => setOpenAlert(search.id)} />}
                              </div>
                            </div>
                          </div>

                          <AccordionContent>

                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                              <div>
                                <p className="text-sm my-auto ml-0 mr-2">Listing Type</p>
                                <div>
                                  <Badge className="bg-blue text-yellow py-1 px-3 mt-2 text-sm">{capitalizeFirstLetter(search.filters.listingType)}</Badge>
                                </div>
                              </div>

                              {search.filters.propertyType.length > 0 && (
                                <div>
                                  <p className="text-sm my-auto ml-0 mr-2">Amenities</p>
                                  <div className="flex flex-wrap">
                                    {
                                      search.filters.propertyType.map((type) => (
                                        <div>
                                          <Badge className="bg-blue text-yellow py-1 px-3 mt-2 text-sm mr-2">{type}</Badge>
                                        </div>
                                      ))
                                    }
                                  </div>

                                </div>
                              )}

                              {search.filters.bedrooms.length > 0 && (
                                <div>
                                  <p className="text-sm my-auto ml-0 mr-2">Bedrooms</p>
                                  <div>
                                    <Badge className="bg-blue text-yellow py-1 px-3 mt-2 text-sm">{search.filters.bedrooms.length > 0 ? search.filters.bedrooms : "Any"}</Badge>
                                  </div>
                                </div>
                              )}

                              {search.filters.bathrooms.length > 0 && (
                                <div>
                                  <p className="text-sm my-auto ml-0 mr-2">Bathrooms</p>
                                  <div>
                                    <Badge className="bg-blue text-yellow py-1 px-3 mt-2 text-sm">{search.filters.bathrooms.length > 0 ? search.filters.bathrooms : "Any"}</Badge>
                                  </div>
                                </div>
                              )}

                              {search.filters.garageSpaces.length > 0 && (
                                <div>
                                  <p className="text-sm my-auto ml-0 mr-2">Garage/Car Spaces Capacity</p>
                                  <div>
                                    <Badge className="bg-blue text-yellow py-1 px-3 mt-2 text-sm">{search.filters.garageSpaces.length > 0 ? search.filters.bathrooms : "Any"}</Badge>
                                  </div>
                                </div>
                              )}

                              {search.filters.amenities.length > 0 && (
                                <div>
                                  <p className="text-sm my-auto ml-0 mr-2">Amenities</p>
                                  <div className="flex flex-wrap">
                                    {
                                      search.filters.amenities.map((amenity) => (
                                        <div>
                                          <Badge className="bg-blue text-yellow py-1 px-3 mt-2 text-sm mr-2">{amenity}</Badge>
                                        </div>
                                      ))
                                    }
                                  </div>

                                </div>
                              )}

                              {search.filters.locality.length > 0 && (
                                <div>
                                  <p className="text-sm my-auto ml-0 mr-2">Localities</p>
                                  <div className="flex flex-wrap">
                                    {
                                      search.filters.locality.map((locality) => (
                                        <div>
                                          <Badge className="bg-blue text-yellow py-1 px-3 mt-2 text-sm mr-2">{locality}</Badge>
                                        </div>
                                      ))
                                    }
                                  </div>

                                </div>
                              )}

                              <div>
                                <p className="text-sm my-auto ml-0 mr-2">Size</p>
                                <div>
                                  <Badge className="bg-blue text-yellow py-1 px-3 mt-2 text-sm">{`${search.filters.size[0]} - ${search.filters.size[1]} metres squared`}</Badge>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm my-auto ml-0 mr-2">Price</p>
                                <div>
                                  <Badge className="bg-blue text-yellow py-1 px-3 mt-2 text-sm">{`€${formatNumberWithCommas(search.filters.priceRange[0])} - €${formatNumberWithCommas(search.filters.priceRange[1])}`}</Badge>
                                </div>
                              </div>

                            </div>

                          </AccordionContent>
                        </AccordionItem>
                      </CardContent>
                    </Card>
                  ))
                  }
                </Accordion>


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
                    searchAlerts.length > 0 &&
                    <Button variant="outline" size="sm" className="w-full mt-1 bg-yellow text-blue" disabled={isLoading} onClick={() => setOpenSearchAlertDialog(true)}>
                      <Plus className="h-3 w-3 mr-1" /> Add New Search Alert
                    </Button>
                  }

                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[425px]">
                  <div className="overflow-auto">
                    <h1 className="text-lg text-center font-bold mb-3">Create a new search alert</h1>
                    <h2 className="text-sm text-center">You will be notified whenever a new property matching this search criteria is listed</h2>
                    <PropertyFilters alertCreation={true} initialFilters={filters} onApply={handleCreateSearchAlert} ></PropertyFilters>
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

