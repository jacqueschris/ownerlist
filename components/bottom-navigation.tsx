'use client';

import { useDisplayContext } from '@/contexts/Display';
import { Home, Heart, User, Calendar } from 'lucide-react';
import { HomeScreen } from './screens/home-screen';
import { FavoritesScreen } from './screens/favorites-screen';
import { ViewingsScreen } from './screens/viewings-screen';
import { ProfileScreen } from './screens/profile-screen';
import { isValidElement } from 'react';

const NAV_ITEMS = [
  { screen: HomeScreen, icon: Home, label: 'Home', component: <HomeScreen /> },
  { screen: FavoritesScreen, icon: Heart, label: 'Favorites', component: <FavoritesScreen /> },
  { screen: ViewingsScreen, icon: Calendar, label: 'Viewings', component: <ViewingsScreen /> },
  { screen: ProfileScreen, icon: User, label: 'Profile', component: <ProfileScreen /> },
];

export function BottomNavigation() {
  const { display, setDisplay } = useDisplayContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2B2D42] border-t border-gray-700 z-10">
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map(({ screen, icon: Icon, label, component }) => {
          const isActive = isValidElement(display) && display.type === screen;
          return (
            <div
              key={label}
              className="flex flex-col items-center justify-center w-full cursor-pointer"
              onClick={() => setDisplay(component)}>
              <Icon className={`h-6 w-6 ${isActive ? 'text-[#F8F32B]' : 'text-white'}`} />
              <span className={`text-xs mt-1 ${isActive ? 'text-[#F8F32B]' : 'text-white'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
