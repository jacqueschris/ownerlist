'use client';

import type React from 'react';
import { Card, CardContent } from './ui/card';
import { Bath, Bed, Building, Car, Heart } from 'lucide-react';
import Image from 'next/image';
import { Property } from '@/types';
import { useDisplayContext } from '@/contexts/Display';
import { formatNumberWithCommas } from '@/components/lib/utils';
import axios from 'axios';
import { useDataContext } from '@/contexts/Data';
import EmptyScreen from './screens/empty-screen';
import { AddPropertyScreen } from './screens/add-property-screen';
import { PropertyDetail } from './property/property-detail';

interface PropertyGridProps {
  properties: Property[];
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  const { setDisplay } = useDisplayContext();
  const { data, setProperties, favouritesIds, removeFavourite, addFavourite } = useDataContext();
  
  let carSpaces: number[] = []
  if(properties){
    for(let i =0; i < properties.length; i++){
      carSpaces[i] = 0
      let property = properties[i]
      if (property.carSpaces) {
        for (let carSpace of property.carSpaces) {
          carSpaces[i] = carSpaces[i] + carSpace.capacity
        }
      }
    }
  }

  const toggleFavorite = async (property: Property, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (favouritesIds!.includes(property.id)) {
      try {
        await axios.post(`/api/favorites/delete`, {
          propertyId: property.id,
          userId: data.id,
          token: window.Telegram.WebApp.initData,
        });
        removeFavourite(property.id)
      } catch (error) {
        console.error('Error updating favorite:', error);
      }
    } else {
      try {
        await axios.post(`/api/favorites/create`, {
          propertyId: property.id,
          userId: data.id,
          token: window.Telegram.WebApp.initData,
        });
        addFavourite(property.id)
      } catch (error) {
        console.error('Error updating favorite:', error);
      }
    }

    setProperties((prev) =>
      prev!.map((p) => (p.id === property.id ? { ...p, isFavorite: !property.isFavorite } : p))
    );
  };

  if (properties && properties.length === 0) {
    return (
      <EmptyScreen
        icon={<Building className="h-6 w-6 text-muted-foreground" />}
        title="No properties available"
        description="Try changing your filters."
      />
    );
  }

  const handlePropertyClick = (property: Property) => {
    if (property.owner.id == data.id) {
      setDisplay(<AddPropertyScreen propertyData={property} />)
    } else {
      setDisplay(<PropertyDetail property={property} />)

    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {properties && properties.map((property, index) => (
        <div
          className=" cursor-pointer"
          key={property.id}
          onClick={() => {
            handlePropertyClick(property)
          }}>
          <Card className="overflow-hidden h-full">
            <div className="relative bg-[#dde1e8]">
              <Image
                src={property.image || `/${property.propertyType}.png`}
                alt={property.title}
                width={400}
                height={300}
                className="w-full h-32 object-contain"
              />
              <button
                className="absolute top-2 right-2 p-1 bg-white rounded-full"
                onClick={(e) => toggleFavorite(property, e)}>
                <Heart
                  className={`h-5 w-5 ${favouritesIds?.includes(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                />
              </button>
            </div>
            <CardContent className="p-3">
              <div className="font-bold text-lg">
                {property.listingType === 'buy'
                  ? `€${formatNumberWithCommas(property.price)}`
                  : `€${formatNumberWithCommas(property.price)}/month`}
              </div>
              <h3 className="text-sm font-medium line-clamp-1">{property.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{property.location}</p>
              <div className="flex text-xs text-gray-500 mt-2 space-x-2">
                {property.propertyType != "garage" && property.propertyType != "shop" &&
                  <div className='flex'>
                    <span className="flex mr-2">
                      {property.bedrooms} <Bed className="h-4 w-4 ml-1 m-auto" />
                    </span>
                    <span>•</span>
                  </div>
                }
                {property.propertyType != "garage" &&
                  <div className='flex'>
                    <span className="flex  mr-2">
                      {property.bathrooms} <Bath className="h-4 w-4 ml-1 m-auto" />
                    </span>
                    <span>•</span>
                  </div>
                }
                  <span className="flex  mr-2">
                    {carSpaces[index]} <Car className="h-4 w-4 ml-1 m-auto" />
                  </span>
                  <span>•</span>

                <span>{property.size} m²</span>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
