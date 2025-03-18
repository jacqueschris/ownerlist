'use client';
import { PropertyGrid } from '../property-grid';
import { BottomNavigation } from '../bottom-navigation';
import { useTelegram } from '../telegram-provider';
import { Property } from '@/types';
import Header from '../header';

export function FavoritesScreen() {
  const { webApp } = useTelegram();

  // Mock data for favorite properties
  let favoriteProperties: Property[] = [];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto pb-16">
        <Header title='Favourites'></Header>

        <div className="p-4">
          {favoriteProperties.length > 0 ? (
            <PropertyGrid properties={favoriteProperties} />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No favorite properties yet</p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
