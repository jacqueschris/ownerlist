"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import ButtonToggle from "./button-toggle"
import type { Filters } from "@/types/index"
import { LocalitiesSelect } from "./localities-select"
import { useDataContext } from "@/contexts/Data"
import { Input } from "./ui/input"
import { MultiSelect } from "./ui/multi-select"

interface PropertyFiltersProps {
  onClose?: () => void
  onApply?: (filters: Filters, searchAlertName?: string) => void
  onReset?: () => void
  initialFilters: Filters
  alertCreation?: boolean
}

export function PropertyFilters({
  onClose,
  onApply,
  onReset,
  initialFilters,
  alertCreation = false,
}: PropertyFiltersProps) {
  const [listingType, setListingType] = useState<"buy" | "rent" | "all">(initialFilters.listingType)
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange)
  const [propertyType, setPropertyType] = useState<string[]>(initialFilters.propertyType || [])
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms)
  const [locality, setLocality] = useState<string[]>(initialFilters.locality)
  const [bathrooms, setBathrooms] = useState(initialFilters.bathrooms)
  const [garageSpaces, setGarageSpaces] = useState(initialFilters.garageSpaces)
  const [size, setSize] = useState<[number, number]>(initialFilters.size)
  const [amenities, setAmenities] = useState<string[]>(initialFilters.amenities)
  const [title, setTitle] = useState<string>("")
  const [createAlertError, setCreateAlertError] = useState<string>("")

  const { properties, addSearchAlert } = useDataContext()

  // Update local state when initialFilters change
  useEffect(() => {
    setListingType(initialFilters.listingType)
    setPriceRange(initialFilters.priceRange)
    setPropertyType(initialFilters.propertyType || [])
    setBedrooms(initialFilters.bedrooms)
    setBathrooms(initialFilters.bathrooms)
    setGarageSpaces(initialFilters.garageSpaces)
    setSize(initialFilters.size)
    setAmenities(initialFilters.amenities)
    setLocality(initialFilters.locality)
  }, [initialFilters])

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity))
    } else {
      setAmenities([...amenities, amenity])
    }
  }

  const handleApply = () => {
    if (onApply) {
      onApply({
        listingType,
        priceRange,
        propertyType,
        bedrooms,
        bathrooms,
        garageSpaces,
        size,
        amenities,
        locality,
      })
    }
  }

  const handleReset = () => {
    if (onReset) {
      onReset()
    }
  }

  const submitSearchAlert = async () => {

    if (title.length == 0) {
      setCreateAlertError("Missing name for search alert")
      return
    }
    if (onApply) {
      onApply(
        {
          listingType,
          priceRange,
          propertyType,
          bedrooms,
          bathrooms,
          garageSpaces,
          size,
          amenities,
          locality,
        },
        title,
      )
    }
  }

  return (
    <div className="bg-white p-4 z-100">
      {properties && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {alertCreation && (
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Terraced House search"
              className="mt-1"
            />
          </div>
        )}
        <ButtonToggle
          id="listing-type"
          label="Listing Type"
          value={listingType}
          onChange={(value) => setListingType(value as "buy" | "rent" | "all")}
          buttons={[
            { value: "all", label: "All" },
            { value: "buy", label: "Buy" },
            { value: "rent", label: "Rent" },
          ]}
        />
        <div>
          <h4 className="font-medium mb-2">Price Range</h4>
          <Slider
            defaultValue={priceRange}
            max={100000000}
            step={1000}
            onValueChange={(value) => setPriceRange(value as [number, number])}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>€{priceRange[0].toLocaleString()}</span>
            <span>€{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Property Type</h4>
          <MultiSelect
            selected={propertyType}
            onChange={setPropertyType}
            placeholder="Select property types..."
            multiple={true}
            options={[
              { value: "apartment", label: "Apartment" },
              { value: "townhouse", label: "Townhouse" },
              { value: "house", label: "House" },
              { value: "villa", label: "Villa" },
              { value: "office", label: "Office" },
              { value: "garage", label: "Garage" },
              { value: "shop", label: "Shop" },
            ]}
          />
        </div>

        <div className="mt-4">
          <LocalitiesSelect
            selected={locality}
            onChange={setLocality}
            placeholder="Select a locality..."
            multiple={true}
            label="Locality"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium mb-2">Bedrooms</h4>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h4 className="font-medium mb-2">Bathrooms</h4>
            <Select value={bathrooms} onValueChange={setBathrooms}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h4 className="font-medium mb-2">Garage Spaces</h4>
            <Select value={garageSpaces} onValueChange={setGarageSpaces}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
                <SelectItem value="6">6+</SelectItem>
                <SelectItem value="7">7+</SelectItem>
                <SelectItem value="8">8+</SelectItem>
                <SelectItem value="9">9+</SelectItem>
                <SelectItem value="10">10+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Size (m²)</h4>

          <Slider
            defaultValue={size}
            max={10000}
            step={10}
            onValueChange={(value) => setSize(value as [number, number])}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{size[0]} m²</span>
            <span>{size[1]} m²</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Amenities</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Balcony",
              "Terrace",
              "Garden",
              "Private Yard",
              "Rooftop Access",
              "Patio",
              "Gated Community",
              "Security System",
              "Doorman/Concierge",
              "Smart Home Features",
              "Reserved Parking",
              "EV Charging Station",
              "Bicycle Storage",
              "Swimming Pool",
              "Jacuzzi/Hot Tub",
              "Sauna",
              "Tennis Court",
              "Basketball Court",
              "Playground",
              "BBQ Area",
              "Clubhouse",
              "Elevator",
              "Fire Alarm System",
              "Smoke Detectors",
              "Wheelchair Accessible",
              "Solar Panels",
              "Air Conditioning",
              "Central Heating",
              "Underfloor Heating",
              "Ceiling Fans",
              "Soundproofing",
              "Walk-in Closet",
              "Fully Equipped Kitchen",
              "Dishwasher",
              "Breakfast Bar",
              "Kitchen Island",
              "Wine Cellar",
              "High-Speed Internet",
              "Cable TV",
              "Home Automation System",
              "Generator Backup",
              "Solar Water Heater",
              "Pet Friendly",
              "Kids Play Area",
              "Nearby Schools",
              "Nearby Parks",
              "Co-Working Space",
              "Conference Room",
              "Home Office"
            ].map(
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

        <div className="flex space-x-4 pt-4">
          {properties && (
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              Reset
            </Button>
          )}

          {alertCreation ? (
            <div className="w-full">
              {createAlertError && <p className="text-sm text-red-500 text-center mb-4">{createAlertError}</p>}
              <Button className="flex-1 bg-[#F8F32B] text-black hover:bg-[#e9e426] w-full" onClick={submitSearchAlert}>
                Save Search
              </Button>
            </div>
          ) : (
            <Button className="flex-1 bg-[#F8F32B] text-black hover:bg-[#e9e426]" onClick={handleApply}>
              {properties ? "Apply Filters" : "Search for properties"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

