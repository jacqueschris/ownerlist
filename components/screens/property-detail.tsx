'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar } from '../ui/calendar';
import { useTelegram } from '../telegram-provider';
import {
  ArrowLeft,
  Heart,
  MapPin,
  Share2,
  Bed,
  Bath,
  Maximize,
  CalendarIcon,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { HomeScreen } from './home-screen';
import { useDisplayContext } from '@/contexts/Display';

interface PropertyDetailProps {
  id: string;
}

export function PropertyDetail({ id }: PropertyDetailProps) {
  const { webApp } = useTelegram();
  const { setDisplay } = useDisplayContext();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Mock property data
  const property = {
    id,
    title: 'Modern 2BR Apartment in Downtown',
    price: 250000,
    location: 'Downtown, New York',
    coordinates: {
      lat: 40.7128,
      lng: -74.006,
    },
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 1,
    size: 85,
    description:
      'This beautiful modern apartment features an open floor plan with large windows providing plenty of natural light. The kitchen is equipped with stainless steel appliances and granite countertops. The master bedroom has a walk-in closet and an en-suite bathroom. The second bedroom is perfect for a home office or guest room. The building offers amenities such as a fitness center, rooftop terrace, and 24-hour concierge service.',
    images: [
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
    ],
    amenities: ['Balcony', 'Elevator', 'Air Conditioning', 'Parking', 'Furnished'],
    owner: {
      name: 'John Doe',
      phone: '+1 234 567 8901',
      email: 'john.doe@example.com',
    },
    listingType: 'buy',
  };

  useEffect(() => {
    if (webApp) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => setDisplay(<HomeScreen />));
    }

    return () => {
      if (webApp) {
        webApp.BackButton.hide();
        webApp.BackButton.offClick(() => setDisplay(<HomeScreen />));
      }
    };
  }, [webApp]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBookViewing = () => {
    // Handle booking logic
    alert(`Viewing requested for ${date?.toDateString()}`);
  };

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`,
      '_blank'
    );
  };

  return (
    <div className="pb-16">
      {/* Image Gallery */}
      <div className="relative">
        <div className="relative h-64 w-full bg-[#dde1e8]">
          <Image
            src={property.images[activeImageIndex] || '/placeholder.svg'}
            alt={property.title}
            fill
            className="object-contain"
          />
          <div className="absolute top-4 left-4 z-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm"
              onClick={() => setDisplay(<HomeScreen />)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm"
              onClick={toggleFavorite}>
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex overflow-x-auto p-2 space-x-2 bg-white">
          {property.images.map((image, index) => (
            <button
              key={index}
              className={`flex-shrink-0 ${
                activeImageIndex === index ? 'ring-2 ring-[#F8F32B]' : ''
              }`}
              onClick={() => setActiveImageIndex(index)}>
              <Image
                src={image || '/placeholder.svg'}
                alt={`Thumbnail ${index + 1}`}
                width={60}
                height={60}
                className="object-cover rounded-md h-16 w-16"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">{property.title}</h1>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.location}</span>
            </div>
          </div>
          <div className="text-2xl font-bold">
            {property.listingType === 'buy'
              ? `$${property.price.toLocaleString()}`
              : `$${property.price}/month`}
          </div>
        </div>

        <div className="flex justify-between mt-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex flex-col items-center">
            <Bed className="h-5 w-5 text-gray-500" />
            <span className="text-sm mt-1">{property.bedrooms} Beds</span>
          </div>
          <div className="flex flex-col items-center">
            <Bath className="h-5 w-5 text-gray-500" />
            <span className="text-sm mt-1">{property.bathrooms} Baths</span>
          </div>
          <div className="flex flex-col items-center">
            <Maximize className="h-5 w-5 text-gray-500" />
            <span className="text-sm mt-1">{property.size} m²</span>
          </div>
        </div>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-gray-600">{property.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Property Type</h3>
              <p className="text-sm text-gray-600">{property.type}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <div className="relative h-40 w-full rounded-lg overflow-hidden mb-2">
                <Image
                  src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+F8F32B(${property.coordinates.lng},${property.coordinates.lat})/${property.coordinates.lng},${property.coordinates.lat},14,0/400x200?access_token=pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xhbXBsZSJ9.example`}
                  alt="Property location map"
                  fill
                  className="object-cover"
                />
              </div>
              <Button variant="outline" className="w-full text-[#2B2D42]" onClick={openGoogleMaps}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Google Maps
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="amenities">
            <div className="grid grid-cols-2 gap-2">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center p-2 bg-gray-50 rounded-md">
                  <div className="h-2 w-2 bg-[#F8F32B] rounded-full mr-2"></div>
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="contact">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Owner Information</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {property.owner.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {property.owner.phone}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {property.owner.email}
                  </p>
                </div>
                <Button className="w-full mt-4 bg-[#F8F32B] text-black hover:bg-[#e9e426]">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Owner
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h3 className="font-semibold mb-4">Book a Viewing</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <Button
            className="w-full mt-4 bg-[#F8F32B] text-black hover:bg-[#e9e426]"
            disabled={!date}
            onClick={handleBookViewing}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Request Viewing
          </Button>
        </div>
      </div>
    </div>
  );
}
