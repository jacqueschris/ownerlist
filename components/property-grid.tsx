'use client';

import type React from 'react';
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Bath, Bed, Heart } from 'lucide-react';
import Image from 'next/image';
import { Property } from '@/types';
import { useDisplayContext } from '@/contexts/Display';
import { PropertyDetail } from './screens/property-detail';

interface PropertyGridProps {
  properties: Property[];
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>(
    properties.reduce((acc, property) => {
      acc[property.id] = property.isFavorite;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const { setDisplay } = useDisplayContext();

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No properties found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {properties.map((property) => (
        <div
          className=" cursor-pointer"
          key={property.id}
          onClick={() => {
            setDisplay(<PropertyDetail id={property.id as string} />);
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
                onClick={(e) => toggleFavorite(property.id, e)}>
                <Heart
                  className={`h-5 w-5 ${
                    favorites[property.id] ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
            <CardContent className="p-3">
              <div className="font-bold text-lg">
                {property.listingType === 'buy'
                  ? `$${property.price.toLocaleString()}`
                  : `$${property.price}/month`}
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
