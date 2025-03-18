'use client';
import { PropertyGrid } from '../property-grid';
import { BottomNavigation } from '../bottom-navigation';
import { useDataContext } from '@/contexts/Data';
import { useEffect, useState } from 'react';
import Header from '../header';
import { Card, CardContent } from '../ui/card';
import { Heart } from 'lucide-react';
import EmptyScreen from './empty-screen';

export function FavoritesScreen() {
  const { properties } = useDataContext();
  const [favorites, setFavorites] = useState(properties!.filter((property) => property.isFavorite));

  useEffect(() => {
    setFavorites(properties!.filter((property) => property.isFavorite));
  }, [properties]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto pb-16">
        <Header title="Favourites" />

        <div className="p-4">
          {favorites && favorites.length > 0 ? (
            <PropertyGrid properties={favorites} />
          ) : (
            <EmptyScreen
              icon={<Heart className="h-6 w-6 text-muted-foreground" />}
              title="No favorite properties yet"
              description="Properties you mark as favorites will appear here"
            />
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
