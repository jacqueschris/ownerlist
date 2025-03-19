'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import ButtonToggle from './button-toggle';
import { Filters } from '@/types';

interface PropertyFiltersProps {
  onClose: () => void;
  onApply: (filters: Filters) => void;
  onReset: () => void;
  initialFilters: Filters;
  searchMade: boolean;
}

export function PropertyFilters({
  onClose,
  onApply,
  onReset,
  initialFilters,
  searchMade,
}: PropertyFiltersProps) {
  const [listingType, setListingType] = useState<'buy' | 'rent' | 'all'>(
    initialFilters.listingType
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange);
  const [propertyType, setPropertyType] = useState(initialFilters.propertyType);
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms);
  const [bathrooms, setBathrooms] = useState(initialFilters.bathrooms);
  const [size, setSize] = useState<[number, number]>(initialFilters.size);
  const [amenities, setAmenities] = useState<string[]>(initialFilters.amenities);

  // Update local state when initialFilters change
  useEffect(() => {
    setListingType(initialFilters.listingType);
    setPriceRange(initialFilters.priceRange);
    setPropertyType(initialFilters.propertyType);
    setBedrooms(initialFilters.bedrooms);
    setBathrooms(initialFilters.bathrooms);
    setSize(initialFilters.size);
    setAmenities(initialFilters.amenities);
  }, [initialFilters]);

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleApply = () => {
    onApply({
      listingType,
      priceRange,
      propertyType,
      bedrooms,
      bathrooms,
      size,
      amenities,
    });
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <div className="bg-white p-4 border-t border-gray-200 z-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        {searchMade && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="space-y-6">
        <ButtonToggle
          id="listing-type"
          label="Listing Type"
          value={listingType}
          onChange={(value) => setListingType(value as 'buy' | 'rent' | 'all')}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'buy', label: 'Buy' },
            { value: 'rent', label: 'Rent' },
          ]}
        />
        <div>
          <h4 className="font-medium mb-2">Price Range</h4>
          <Slider
            defaultValue={priceRange}
            max={1000000}
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
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Bedrooms</h4>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
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
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Size (m²)</h4>

          <Slider
            defaultValue={size}
            max={500}
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
              'Balcony',
              'Pool',
              'Parking',
              'Garden',
              'Elevator',
              'Air Conditioning',
              'Furnished',
              'Pet Friendly',
            ].map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={amenities.includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                />
                <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button
            className="flex-1 bg-[#F8F32B] text-black hover:bg-[#e9e426]"
            onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
