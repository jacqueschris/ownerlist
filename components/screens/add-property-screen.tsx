"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import { useTelegram } from "../telegram-provider"
import { X, Plus, Clock, Loader2, ImageIcon, AlertCircle, MapPin, Trash2 } from "lucide-react"
import { HomeScreen } from "./home-screen"
import { useDisplayContext } from "@/contexts/Display"
import { useDataContext } from "@/contexts/Data"
import ButtonToggle from "../button-toggle"
import MapWrapper from "../ui/map-wrapper"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import axios from "axios"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "../header"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Property } from "@/types"

// Type for selected image files
interface SelectedImage {
  file: File
  previewUrl: string
}

// List of Malta localities for matching
const maltaLocalities = [
  "Attard",
  "Balzan",
  "Birgu",
  "Birkirkara",
  "Birzebbuga",
  "Bormla",
  "Dingli",
  "Fgura",
  "Floriana",
  "Gudja",
  "Gzira",
  "Hamrun",
  "Iklin",
  "Isla",
  "Kalkara",
  "Kirkop",
  "Lija",
  "Luqa",
  "Marsa",
  "Marsaskala",
  "Marsaxlokk",
  "Mdina",
  "Mellieha",
  "Mgarr",
  "Mosta",
  "Mqabba",
  "Msida",
  "Mtarfa",
  "Naxxar",
  "Paola",
  "Pembroke",
  "Pieta",
  "Qormi",
  "Qrendi",
  "Rabat",
  "Safi",
  "San Gwann",
  "Santa Lucija",
  "Santa Venera",
  "Siggiewi",
  "Sliema",
  "St. Julian's",
  "St. Paul's Bay",
  "Swieqi",
  "Ta' Xbiex",
  "Tarxien",
  "Valletta",
  "Xghajra",
  "Zabbar",
  "Zebbug",
  "Zejtun",
  "Zurrieq",
  "Gozo - Victoria",
  "Gozo - Fontana",
  "Gozo - Ghajnsielem",
  "Gozo - Gharb",
  "Gozo - Ghasri",
  "Gozo - Kercem",
  "Gozo - Munxar",
  "Gozo - Nadur",
  "Gozo - Qala",
  "Gozo - San Lawrenz",
  "Gozo - Sannat",
  "Gozo - Xaghra",
  "Gozo - Xewkija",
  "Gozo - Zebbug",
]

interface AddPropertyScreenProps {
  propertyData?: Property
}

export function AddPropertyScreen({ propertyData }: AddPropertyScreenProps) {
  const { setDisplay, setShowAddPropertyButton } = useDisplayContext()
  const { isLoading, updateProperty, properties, deleteProperty } = useDataContext()
  const { webApp } = useTelegram()
  const [listingType, setListingType] = useState<"buy" | "rent">("buy")
  const [propertyType, setPropertyType] = useState("")
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [locality, setLocality] = useState("")
  const [size, setSize] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [descriptionError, setDescriptionError] = useState("")
  const [amenities, setAmenities] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [availabilitySchedule, setAvailabilitySchedule] = useState<
    {
      day: string
      timeSlots: { start: string; end: string }[]
    }[]
  >([])
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [timeSlot, setTimeSlot] = useState<{ start: string; end: string }>({
    start: "09:00",
    end: "10:00",
  })
  const [timeSlotError, setTimeSlotError] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [locationError, setLocationError] = useState<string>("")
  const [carSpaces, setCarSpaces] = useState<{ type: "garage" | "carspace"; capacity: number }[]>([])
  const [newCarSpaceType, setNewCarSpaceType] = useState<"garage" | "carspace">("garage")
  const [newCarSpaceCapacity, setNewCarSpaceCapacity] = useState<number>(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Map state
  const [position, setPosition] = useState<[number, number]>([35.8977, 14.5128]) // Default to Valletta, Malta
  const [mapReady, setMapReady] = useState(false)

  // Determine if we're in edit mode
  const isEditMode = !!propertyData

  // Populate form with existing data if in edit mode
  useEffect(() => {
    if (propertyData) {
      propertyData = properties?.find((property: any) => property.id == propertyData?.id)!

      setListingType(propertyData.listingType)
      setPropertyType(propertyData.propertyType)
      setTitle(propertyData.title)
      setPrice(String(propertyData.price))
      setBedrooms(String(propertyData.bedrooms))
      setBathrooms(String(propertyData.bathrooms))
      setSize(String(propertyData.size))
      setLocality(propertyData.locality)
      setLocation(propertyData.location)
      setPosition([propertyData.position[0], propertyData.position[1]])
      setDescription(propertyData.description)
      setAmenities(propertyData.amenities)
      setAvailabilitySchedule(propertyData.availabilitySchedule)
      setCarSpaces(propertyData.carSpaces)

      // Set remote images if available
      if (propertyData.images && propertyData.images.length > 0) {
        setImages(propertyData.images)
      }
    }
  }, [propertyData])

  useEffect(() => {
    // This is needed because Leaflet requires window to be defined
    setMapReady(true)

    if (webApp) {
      webApp.BackButton.show()
      webApp.BackButton.onClick(handleBack)
    }

    return () => {
      if (webApp) {
        webApp.BackButton.hide()
        webApp.BackButton.offClick(handleBack)
      }
    }
  }, [webApp])

  const handleBack = () => {
    setDisplay(<HomeScreen />)
    setShowAddPropertyButton(true)
  }

  const getLocationFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      )
      const data = await response.json()

      if (data && data.display_name) {
        // Try to extract locality from address components
        if (data.address) {
          // Check various address fields that might contain the locality
          const locality =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.suburb ||
            data.address.municipality

          // If we found a locality that matches one in our dropdown, update it
          if (locality) {
            const matchingLocality = maltaLocalities.find(
              (loc) =>
                loc.toLowerCase() === locality.toLowerCase() ||
                loc.toLowerCase().includes(locality.toLowerCase()) ||
                locality.toLowerCase().includes(loc.toLowerCase()),
            )

            // if (matchingLocality) {
            //   setLocality(matchingLocality)
            // }
          }
        }
        return data
      }
      return null
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getLocationFromCoordinates(position[0], position[1]).then((data) => {
      if (data) {
        setLocation(data.display_name)
      }
    })
  }, [position])

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl)
      })
    }
  }, [selectedImages])

  // Validate description when it changes
  useEffect(() => {
    if (description.length > 0 && description.length < 10) {
      setDescriptionError("Description must be at least 10 characters long")
    } else {
      setDescriptionError("")
    }
  }, [description])

  // Validate time slot when it changes
  useEffect(() => {
    if (timeSlot.start && timeSlot.end) {
      if (timeSlot.start >= timeSlot.end) {
        setTimeSlotError("Start time must be before end time")
      } else {
        setTimeSlotError("")
      }
    }
  }, [timeSlot])

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity))
    } else {
      setAmenities([...amenities, amenity])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Create preview URLs for selected files
    const newImages: SelectedImage[] = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    // Add to selected images
    setSelectedImages([...selectedImages, ...newImages])

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prevImages) => {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(prevImages[index].previewUrl)

      // Remove the image from the array
      const newImages = [...prevImages]
      newImages.splice(index, 1)
      return newImages
    })
  }

  const removeRemoteImage = (index: number) => {
    let newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleAddressSearch = async () => {
    if (location.trim() === "") {
      setLocationError("Please enter a location to search")
      return
    }

    setLocationError("")

    try {
      // Using Nominatim for geocoding (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        setPosition([Number.parseFloat(lat), Number.parseFloat(lon)])

        // Try to extract locality from the search result
        if (data[0].address) {
          const locality =
            data[0].address.city ||
            data[0].address.town ||
            data[0].address.village ||
            data[0].address.suburb ||
            data[0].address.municipality

          if (locality) {
            const matchingLocality = maltaLocalities.find(
              (loc) =>
                loc.toLowerCase() === locality.toLowerCase() ||
                loc.toLowerCase().includes(locality.toLowerCase()) ||
                locality.toLowerCase().includes(loc.toLowerCase()),
            )

            if (matchingLocality) {
              setLocality(matchingLocality)
            }
          }
        }

        toast({
          title: "Location found",
          description: "You can adjust the pin position if needed",
        })
      } else {
        setLocationError("Location not found. Please try a different address or manually position the pin on the map.")
      }
    } catch (error) {
      console.error("Error searching for address:", error)
      setLocationError("Error searching for address. Please try again or manually position the pin on the map.")
    }
  }

  const addDay = () => {
    if (!selectedDay || availabilitySchedule.some((schedule) => schedule.day === selectedDay)) {
      return
    }

    setAvailabilitySchedule([...availabilitySchedule, { day: selectedDay, timeSlots: [] }])
    setSelectedDay("")
  }

  const removeDay = (day: string) => {
    setAvailabilitySchedule(availabilitySchedule.filter((schedule) => schedule.day !== day))
  }

  const addTimeSlot = (day: string) => {
    // Validate time slot before adding
    if (timeSlot.start >= timeSlot.end) {
      setTimeSlotError("Start time must be before end time")
      return
    }

    const existingTimeSlot = availabilitySchedule.find(
      (schedule) =>
        schedule.day === day &&
        schedule.timeSlots.some((slot) => slot.start === timeSlot.start && slot.end === timeSlot.end),
    )

    if (existingTimeSlot) {
      setTimeSlotError("Time slot already added")
      return
    }

    setTimeSlotError("")

    setAvailabilitySchedule(
      availabilitySchedule.map((schedule) => {
        if (schedule.day === day) {
          return {
            ...schedule,
            timeSlots: [...schedule.timeSlots, { ...timeSlot }],
          }
        }
        return schedule
      }),
    )

    // Reset time slot to default for next addition
    setTimeSlot({ start: "09:00", end: "10:00" })
  }

  const removeTimeSlot = (day: string, index: number) => {
    setAvailabilitySchedule(
      availabilitySchedule.map((schedule) => {
        if (schedule.day === day) {
          const updatedSlots = [...schedule.timeSlots]
          updatedSlots.splice(index, 1)
          return {
            ...schedule,
            timeSlots: updatedSlots,
          }
        }
        return schedule
      }),
    )
  }

  const addCarSpace = () => {
    // Check if we already have this type of car space
    const hasGarage = carSpaces.some((space) => space.type === "garage")
    const hasCarSpace = carSpaces.some((space) => space.type === "carspace")

    if (newCarSpaceType === "garage" && hasGarage) {
      toast({
        title: "Error",
        description: "You can only add one garage",
        variant: "destructive",
      })
      return
    }

    if (newCarSpaceType === "carspace" && hasCarSpace) {
      toast({
        title: "Error",
        description: "You can only add one car space",
        variant: "destructive",
      })
      return
    }

    setCarSpaces([
      ...carSpaces,
      {
        type: newCarSpaceType,
        capacity: newCarSpaceCapacity,
      },
    ])

    // Reset values
    setNewCarSpaceType("garage")
    setNewCarSpaceCapacity(1)
  }

  const removeCarSpace = (index: number) => {
    const newCarSpaces = [...carSpaces]
    newCarSpaces.splice(index, 1)
    setCarSpaces(newCarSpaces)
  }

  const handleDelete = async () => {
    if (!propertyData?.id) return

    setIsDeleting(true)
    try {
      const response = await axios.request({
        method: "delete",
        url: "/api/property/delete",
        data: {
          id: propertyData?.id,
          token: window.Telegram.WebApp.initData,
        },
      });

      if (response.status != 200) {
        setError(isEditMode ? "Failed to update property" : "Failed to submit property")
        return
      }

      toast({
        title: "Property Deleted",
        description: "Your property listing has been deleted",
        variant: "default",
      })
      await deleteProperty(propertyData.id)
      setDisplay(<HomeScreen />)
      setShowAddPropertyButton(true)
    } catch (error) {
      console.error("Error deleting property:", error)
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset all errors
    setError("")

    // Validate description length
    if (description.length < 10) {
      setError("Description must be at least 10 characters long")
      return
    }

    // Validate that all days have at least one time slot
    const dayWithoutTimeSlots = availabilitySchedule.find((schedule) => schedule.timeSlots.length === 0)
    if (dayWithoutTimeSlots) {
      setError(`Please add at least one time slot for ${dayWithoutTimeSlots.day}`)
      return
    }

    // Start submission process
    setIsSubmitting(true)

    try {
      // Build the complete property object
      const propertyDataToSend = {
        id: isEditMode && propertyData ? propertyData.id : undefined,
        listingType,
        propertyType,
        title,
        price: Number(price),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        size: Number(size),
        location,
        locality,
        position,
        description,
        amenities,
        availabilitySchedule,
        carSpaces,
        retainedImageIds: images
      }

      const formData = new FormData()
      selectedImages.forEach((file) => {
        formData.append("files", file.file) // Same key for all files
      })
      formData.append("property", JSON.stringify(propertyDataToSend)) // Append additional data
      formData.append("token", window.Telegram.WebApp.initData) // Append additional data

      // Log the complete object
      console.log("Property Data:", propertyDataToSend)

      // Use different endpoints for create vs update
      const endpoint = isEditMode ? `/api/property/update` : "/api/property/create"
      const response = await axios.post(endpoint, formData)

      if (response.status != 200) {
        setError(isEditMode ? "Failed to update property" : "Failed to submit property")
        return
      }

      // Show success toast notification
      toast({
        title: isEditMode ? "Property Updated Successfully" : "Property Added Successfully",
        description: isEditMode ? "Your property listing has been updated" : "Your property listing has been created",
        variant: "default",
      })

      // Continue with form submission
      if (isEditMode) {
        await updateProperty(response.data.property)
      }
      setDisplay(<HomeScreen />)
      setShowAddPropertyButton(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      setError(
        isEditMode ? "Failed to update property. Please try again." : "Failed to submit property. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pb-16">
      <Header showBack={true} title={isEditMode ? "Edit Property" : "List New Property"}></Header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <ButtonToggle
              id="listing-type"
              label="Listing Type"
              value={listingType}
              onChange={(value) => setListingType(value as "buy" | "rent")}
              buttons={[
                { value: "buy", label: "Buy" },
                { value: "rent", label: "Rent" },
              ]}
            />

            <div>
              <Label htmlFor="property-type">Property Type</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger id="property-type" className="mt-1">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern 2BR Apartment in Downtown"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="price">{listingType === "buy" ? "Price (€)" : "Monthly Rent (€)"}</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 250000"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Property Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger id="bedrooms" className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, "6+"].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Select value={bathrooms} onValueChange={setBathrooms}>
                <SelectTrigger id="bathrooms" className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, "5+"].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="size">Size (m²)</Label>
            <Input
              id="size"
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g. 85"
              className="mt-1"
            />
          </div>

          <div className="mt-4">
            <Label htmlFor="locality">Locality</Label>
            <Select value={locality} onValueChange={setLocality}>
              <SelectTrigger id="locality" className="mt-1">
                <SelectValue placeholder="Select locality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Attard">Attard</SelectItem>
                <SelectItem value="Balzan">Balzan</SelectItem>
                <SelectItem value="Birgu">Birgu</SelectItem>
                <SelectItem value="Birkirkara">Birkirkara</SelectItem>
                <SelectItem value="Birzebbuga">Birzebbuga</SelectItem>
                <SelectItem value="Bormla">Bormla</SelectItem>
                <SelectItem value="Dingli">Dingli</SelectItem>
                <SelectItem value="Fgura">Fgura</SelectItem>
                <SelectItem value="Floriana">Floriana</SelectItem>
                <SelectItem value="Gudja">Gudja</SelectItem>
                <SelectItem value="Gzira">Gzira</SelectItem>
                <SelectItem value="Hamrun">Hamrun</SelectItem>
                <SelectItem value="Iklin">Iklin</SelectItem>
                <SelectItem value="Isla">Isla</SelectItem>
                <SelectItem value="Kalkara">Kalkara</SelectItem>
                <SelectItem value="Kirkop">Kirkop</SelectItem>
                <SelectItem value="Lija">Lija</SelectItem>
                <SelectItem value="Luqa">Luqa</SelectItem>
                <SelectItem value="Marsa">Marsa</SelectItem>
                <SelectItem value="Marsaskala">Marsaskala</SelectItem>
                <SelectItem value="Marsaxlokk">Marsaxlokk</SelectItem>
                <SelectItem value="Mdina">Mdina</SelectItem>
                <SelectItem value="Mellieha">Mellieha</SelectItem>
                <SelectItem value="Mgarr">Mgarr</SelectItem>
                <SelectItem value="Mosta">Mosta</SelectItem>
                <SelectItem value="Mqabba">Mqabba</SelectItem>
                <SelectItem value="Msida">Msida</SelectItem>
                <SelectItem value="Mtarfa">Mtarfa</SelectItem>
                <SelectItem value="Naxxar">Naxxar</SelectItem>
                <SelectItem value="Paola">Paola</SelectItem>
                <SelectItem value="Pembroke">Pembroke</SelectItem>
                <SelectItem value="Pieta">Pieta</SelectItem>
                <SelectItem value="Qormi">Qormi</SelectItem>
                <SelectItem value="Qrendi">Qrendi</SelectItem>
                <SelectItem value="Rabat">Rabat</SelectItem>
                <SelectItem value="Safi">Safi</SelectItem>
                <SelectItem value="San Gwann">San Gwann</SelectItem>
                <SelectItem value="Santa Lucija">Santa Lucija</SelectItem>
                <SelectItem value="Santa Venera">Santa Venera</SelectItem>
                <SelectItem value="Siggiewi">Siggiewi</SelectItem>
                <SelectItem value="Sliema">Sliema</SelectItem>
                <SelectItem value="St. Julian's">St. Julian's</SelectItem>
                <SelectItem value="St. Paul's Bay">St. Paul's Bay</SelectItem>
                <SelectItem value="Swieqi">Swieqi</SelectItem>
                <SelectItem value="Ta' Xbiex">Ta' Xbiex</SelectItem>
                <SelectItem value="Tarxien">Tarxien</SelectItem>
                <SelectItem value="Valletta">Valletta</SelectItem>
                <SelectItem value="Xghajra">Xghajra</SelectItem>
                <SelectItem value="Zabbar">Zabbar</SelectItem>
                <SelectItem value="Zebbug">Zebbug</SelectItem>
                <SelectItem value="Zejtun">Zejtun</SelectItem>
                <SelectItem value="Zurrieq">Zurrieq</SelectItem>
                <SelectItem value="Gozo - Victoria">Gozo - Victoria</SelectItem>
                <SelectItem value="Gozo - Fontana">Gozo - Fontana</SelectItem>
                <SelectItem value="Gozo - Ghajnsielem">Gozo - Ghajnsielem</SelectItem>
                <SelectItem value="Gozo - Gharb">Gozo - Gharb</SelectItem>
                <SelectItem value="Gozo - Ghasri">Gozo - Ghasri</SelectItem>
                <SelectItem value="Gozo - Kercem">Gozo - Kercem</SelectItem>
                <SelectItem value="Gozo - Munxar">Gozo - Munxar</SelectItem>
                <SelectItem value="Gozo - Nadur">Gozo - Nadur</SelectItem>
                <SelectItem value="Gozo - Qala">Gozo - Qala</SelectItem>
                <SelectItem value="Gozo - San Lawrenz">Gozo - San Lawrenz</SelectItem>
                <SelectItem value="Gozo - Sannat">Gozo - Sannat</SelectItem>
                <SelectItem value="Gozo - Xaghra">Gozo - Xaghra</SelectItem>
                <SelectItem value="Gozo - Xewkija">Gozo - Xewkija</SelectItem>
                <SelectItem value="Gozo - Zebbug">Gozo - Zebbug</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4">
            <Label htmlFor="location">Location</Label>
            <div className="relative mt-1 flex items-center">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Downtown, New York"
                className="pl-10 pr-20"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#F8F32B] text-black hover:bg-[#e9e426]"
                onClick={handleAddressSearch}
              >
                Search
              </Button>
            </div>
            {locationError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}
          </div>

          {mapReady && (
            <div className="mt-4">
              <Label className="flex items-center mb-2">
                <span>Map Location</span>
                <span className="text-xs text-gray-500 ml-2">(Drag pin to adjust exact location)</span>
              </Label>
              <div className="h-60 rounded-md border overflow-hidden relative">
                <MapWrapper position={position} setPosition={setPosition} />
                <div className="absolute bottom-2 right-2 z-[2] bg-white p-2 rounded-md shadow-md text-xs">
                  <div>Lat: {position[0].toFixed(6)}</div>
                  <div>Lng: {position[1].toFixed(6)}</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your property..."
              className={`mt-1 ${descriptionError ? "border-red-500" : ""}`}
              rows={5}
            />
            {descriptionError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{descriptionError}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <Label>Car Spaces</Label>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-[#F8F32B] text-black hover:bg-[#e9e426]"
                  disabled={carSpaces.length >= 2 || isLoading}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Car Space
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add Car Space</AlertDialogTitle>
                  <AlertDialogDescription>Select the type of car space and its capacity.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <RadioGroup
                      value={newCarSpaceType}
                      onValueChange={(value) => setNewCarSpaceType(value as "garage" | "carspace")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="garage" id="garage" />
                        <Label htmlFor="garage">Garage</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="carspace" id="carspace" />
                        <Label htmlFor="carspace">Car Space</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity (number of cars)</Label>
                    <Select
                      value={String(newCarSpaceCapacity)}
                      onValueChange={(value) => setNewCarSpaceCapacity(Number(value))}
                    >
                      <SelectTrigger id="capacity">
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={addCarSpace} className="bg-[#F8F32B] text-black hover:bg-[#e9e426]">
                    Add
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {carSpaces.length === 0 ? (
            <div className="text-center py-4 border rounded-md bg-gray-50">
              <p className="text-gray-500">No car spaces added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {carSpaces.map((space, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border-2">
                  <div>
                    <span className="font-medium capitalize">{space.type}</span>
                    <span className="ml-2 text-gray-500">
                      {space.capacity} {space.capacity === 1 ? "car" : "cars"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCarSpace(index)}
                    className="h-8 w-8 p-0"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove car space</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-2 gap-2">
            {["Balcony", "Pool", "Parking", "Garden", "Elevator", "Air Conditioning", "Furnished", "Pet Friendly"].map(
              (amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                </div>
              ),
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Property Images</h2>
          <div className="flex flex-wrap gap-2">
            {/* Display existing remote images */}
            {images.map((image, index) => (
              <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                <img src={image || "/placeholder.svg"} alt="Property" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => removeRemoteImage(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* Display newly selected images */}
            {selectedImages.map((image, index) => (
              <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                <img
                  src={image.previewUrl || "/placeholder.svg"}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeSelectedImage(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isLoading || isSubmitting}
                multiple
              />
              <Button
                type="button"
                variant="outline"
                className="w-24 h-24 flex flex-col items-center justify-center"
                disabled={isLoading || isSubmitting}
              >
                <ImageIcon className="h-6 w-6 mb-1" />
                <span className="text-xs">Add Photos</span>
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Images will be uploaded when you submit the form</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Availability for Viewings</h2>
          <p className="text-sm text-gray-500 mb-2">
            Add days and time slots when you're available for property viewings
          </p>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={addDay}
                disabled={
                  !selectedDay || availabilitySchedule.some((schedule) => schedule.day === selectedDay) || isLoading
                }
                className="bg-[#F8F32B] text-black hover:bg-[#e9e426]"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Day
              </Button>
            </div>

            {availabilitySchedule.length === 0 && (
              <div className="text-center py-6 border rounded-md bg-gray-50">
                <p className="text-gray-500">No availability added yet</p>
              </div>
            )}

            <div className="space-y-3">
              {availabilitySchedule.map((schedule) => (
                <div key={schedule.day} className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{schedule.day}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDay(schedule.day)}
                      className="h-8 w-8 p-0"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove {schedule.day}</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {schedule.timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {slot.start} - {slot.end}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(schedule.day, index)}
                          className="h-6 w-6 p-0"
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove time slot</span>
                        </Button>
                      </div>
                    ))}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full mt-1" disabled={isLoading}>
                          <Plus className="h-3 w-3 mr-1" /> Add Time Slot
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add Time Slot for {schedule.day}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`start-time-${schedule.day}`}>Start Time</Label>
                              <Input
                                id={`start-time-${schedule.day}`}
                                type="time"
                                value={timeSlot.start}
                                onChange={(e) => setTimeSlot({ ...timeSlot, start: e.target.value })}
                                className={timeSlotError ? "border-red-500" : ""}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`end-time-${schedule.day}`}>End Time</Label>
                              <Input
                                id={`end-time-${schedule.day}`}
                                type="time"
                                value={timeSlot.end}
                                onChange={(e) => setTimeSlot({ ...timeSlot, end: e.target.value })}
                                className={timeSlotError ? "border-red-500" : ""}
                              />
                            </div>
                          </div>
                          {timeSlotError && <p className="text-red-500 text-sm">{timeSlotError}</p>}
                          <Button
                            type="button"
                            onClick={() => addTimeSlot(schedule.day)}
                            className="bg-[#F8F32B] text-black hover:bg-[#e9e426]"
                            disabled={!!timeSlotError || isLoading}
                          >
                            Add Time Slot
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>}

        {/* Conditional rendering of buttons based on edit/create mode */}
        <div className={`flex ${isEditMode ? "gap-4" : ""}`}>
          {isEditMode ? (
            <>
              <Button
                type="submit"
                className="flex-1 bg-[#F8F32B] text-black hover:bg-[#e9e426]"
                disabled={isLoading || isSubmitting || isDeleting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>

              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1"
                    disabled={isLoading || isSubmitting || isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Listing
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your property listing.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <Button
              type="submit"
              className="w-full bg-[#F8F32B] text-black hover:bg-[#e9e426]"
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Images & Submitting...
                </>
              ) : (
                "Submit Listing"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

