'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Calendar } from '../ui/calendar';
import { useTelegram } from '../telegram-provider';
import { ArrowLeft, Upload, MapPin } from 'lucide-react';
import { HomeScreen } from './home-screen';
import { useDisplayContext } from '@/contexts/Display';
import ButtonToggle from '../button-toggle';
import MapWrapper from '../ui/map-wrapper';

export function AddPropertyScreen() {
  const { setDisplay, setShowAddPropertyButton } = useDisplayContext();
  const { webApp } = useTelegram();
  const [listingType, setListingType] = useState<'buy' | 'rent'>('buy');
  const [propertyType, setPropertyType] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [size, setSize] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<Date[]>([]);

  // Map state
  const [position, setPosition] = useState<[number, number]>([35.8977, 14.5128]); // Default to Valletta, Malta
  const [mapReady, setMapReady] = useState(false);

  const handleBack = () => {
    setDisplay(<HomeScreen />);
    setShowAddPropertyButton(true);
  };

  useEffect(() => {
    // This is needed because Leaflet requires window to be defined
    setMapReady(true);

    if (webApp) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(handleBack);
    }

    return () => {
      if (webApp) {
        webApp.BackButton.hide();
        webApp.BackButton.offClick(handleBack);
      }
    };
  }, [webApp]);

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleAddImage = () => {
    // In a real app, this would handle image upload
    // For now, we'll just add a placeholder
    setImages([...images, '/placeholder.svg?height=300&width=400']);
  };

  const handleAddressSearch = async () => {
    if (location.trim() === '') return;

    try {
      // Using Nominatim for geocoding (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setPosition([Number.parseFloat(lat), Number.parseFloat(lon)]);
      } else {
        alert('Location not found. Please try a different address.');
      }
    } catch (error) {
      console.error('Error searching for address:', error);
      alert('Error searching for address. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplay(<HomeScreen />);
    setShowAddPropertyButton(true);
  };

  return (
    <div className="pb-16">
      <div className="sticky top-0 z-10 bg-blue p-4 border-b flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={handleBack}>
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <h1 className="text-lg text-white font-bold">Add New Property</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Property Images</h2>
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
                <img
                  src={image || '/placeholder.svg'}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-24 h-24 flex flex-col items-center justify-center"
              onClick={handleAddImage}>
              <Upload className="h-6 w-6 mb-1" />
              <span className="text-xs">Add Photo</span>
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <ButtonToggle
              id="listing-type"
              label="Listing Type"
              value={listingType}
              onChange={() => setListingType}
              buttons={[
                { value: 'buy', label: 'Buy' },
                { value: 'rent', label: 'Rent' },
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
              <Label htmlFor="price">
                {listingType === 'buy' ? 'Price ($)' : 'Monthly Rent ($)'}
              </Label>
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
                  {[1, 2, 3, 4, 5, '6+'].map((num) => (
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
                  {[1, 2, 3, 4, '5+'].map((num) => (
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
                onClick={handleAddressSearch}>
                Search
              </Button>
            </div>
          </div>

          {mapReady && (
            <div className="mt-4">
              <Label className="flex items-center mb-2">
                <span>Map Location</span>
                <span className="text-xs text-gray-500 ml-2">
                  (Drag pin to adjust exact location)
                </span>
              </Label>
              <div className="h-60 rounded-md border overflow-hidden relative">
                <MapWrapper position={position} setPosition={setPosition} />
                <div className="absolute bottom-2 right-2 z-[1000] bg-white p-2 rounded-md shadow-md text-xs">
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
              className="mt-1"
              rows={5}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Amenities</h2>
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

        <div>
          <h2 className="text-lg font-semibold mb-4">Availability for Viewings</h2>
          <p className="text-sm text-gray-500 mb-2">
            Select days when you're available for property viewings
          </p>
          <Calendar
            mode="multiple"
            selected={availableDays}
            onSelect={() => setAvailableDays}
            className="rounded-md border w-full"
          />
        </div>

        <Button type="submit" className="w-full bg-[#F8F32B] text-black hover:bg-[#e9e426]">
          Submit Listing
        </Button>
      </form>
    </div>
  );
}
