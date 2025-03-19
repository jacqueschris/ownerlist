'use client';

import type React from 'react';
import { Card, CardContent } from './ui/card';
import { Bath, Bed, Building, Heart } from 'lucide-react';
import Image from 'next/image';
import { Property } from '@/types';
import { useDisplayContext } from '@/contexts/Display';
import { PropertyDetail } from './screens/property-detail';
import { formatNumberWithCommas } from '@/components/lib/utils';
import axios from 'axios';
import { useDataContext } from '@/contexts/Data';
import EmptyScreen from './screens/empty-screen';

interface PropertyGridProps {
  properties: Property[];
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  const { setDisplay } = useDisplayContext();
  const { data, setProperties, favouritesIds } = useDataContext();

  const toggleFavorite = async (property: Property, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (property.isFavorite) {
      try {
        await axios.post(`/api/favorites/delete`, {
          propertyId: property.id,
          userId: data.id,
          token: window.Telegram.WebApp.initData,
        });
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
      } catch (error) {
        console.error('Error updating favorite:', error);
      }
    }

    setProperties((prev) =>
      prev!.map((p) => (p.id === property.id ? { ...p, isFavorite: !property.isFavorite } : p))
    );
  };

  if (properties.length === 0) {
    return (
      <EmptyScreen
        icon={<Building className="h-6 w-6 text-muted-foreground" />}
        title="No properties available"
        description="Try changing your filters."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {properties.map((property) => (
        <div
          className=" cursor-pointer"
          key={property.id}
          onClick={() => {
            setDisplay(<PropertyDetail property={property} />);
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
                  className={`h-5 w-5 ${
                    favouritesIds?.includes(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
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
                <span className="flex">
                  {property.bedrooms} <Bed className="h-4 w-4 ml-2 m-auto" />
                </span>
                <span>•</span>
                <span className="flex">
                  {property.bathrooms} <Bath className="h-4 w-4 ml-2 m-auto" />
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
