'use client';

import { useEffect, useState } from 'react';
import { SearchBar } from '../ui/search-bar';
import { PropertyFilters } from '../property-filters';
import { PropertyGrid } from '../property-grid';
import { BottomNavigation } from '../bottom-navigation';
import { Button } from '../ui/button';
import { LoaderCircle, Plus } from 'lucide-react';
import { AddPropertyScreen } from './add-property-screen';
import { useDisplayContext } from '@/contexts/Display';
import { useDataContext } from '@/contexts/Data';
import { Filters } from '@/types';
import Header from '../header';
import EmptyScreen from './empty-screen';
import axios from 'axios';

export function HomeScreen() {
  const { setDisplay, showAddPropertyButton, setShowAddPropertyButton } = useDisplayContext();
  const { properties, getProperties, addSearchAlert, isLoading } = useDataContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [propertiesLoading, setPropertiesLoading] = useState(false);

  // Initialize filters with default values
  const [filters, setFilters] = useState<Filters>({
    listingType: 'all',
    priceRange: [0, 100000000],
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    size: [0, 10000],
    amenities: [],
    locality: []
  });

  const handleAddProperty = () => {
    setDisplay(<AddPropertyScreen />);
    setShowAddPropertyButton(false);
  };

  const handleApplyFilters = async (newFilters: Filters) => {
    setFilters(newFilters);
    setFiltersVisible(false);
    setShowAddPropertyButton(true);
    setPropertiesLoading(true);

    try {
      await getProperties(window.Telegram.WebApp.initData, newFilters);
    } catch {
      console.error(console.error());
    }

    setPropertiesLoading(false);
  };

  if (propertiesLoading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-auto pb-16">
          <Header title="Favourites" />

          <div className="p-4">
            <EmptyScreen
              icon={<LoaderCircle className="loader-circle h-6 w-6 text-muted-foreground" />}
              title="Loading properties"
              description="Please wait while we load the properties"
            />
          </div>
        </div>
      </div>
    );
  }

  if(isLoading) {
    <EmptyScreen
    icon={<LoaderCircle className="loader-circle h-6 w-6 text-muted-foreground" />}
    title="Loading..."
    description="Please be patient while we load your data"
  />
  }

  const handleResetFilters = () => {
    setFilters({
      listingType: 'all',
      priceRange: [0, 100000000],
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      size: [0, 10000],
      amenities: [],
      locality: []
    });
  };

  const handleCloseFilters = () => {
    setFiltersVisible(false);
    setShowAddPropertyButton(true);
  };

  const handleFilterClick = () => {
    setFiltersVisible(!filtersVisible);
    setShowAddPropertyButton(!showAddPropertyButton);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto pb-16">
        <div className="sticky top-0 z-10 bg-blue shadow-sm">
          {properties ? (
            <div className="p-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onFilterClick={handleFilterClick}
              />
            </div>
          ) : (
            <Header title="Search for properties" />
          )}
          {(filtersVisible || !properties) && (
            <PropertyFilters
              onClose={handleCloseFilters}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              initialFilters={filters}
            />
          )}
        </div>
        {!filtersVisible && (
          <div className="p-4">
            <PropertyGrid properties={properties!} />
          </div>
        )}
      </div>

      {showAddPropertyButton && (
        <div className="fixed bottom-[75px] right-4 z-20">
          <Button
            className="rounded-full w-14 h-14 bg-[#F8F32B] text-black hover:bg-[#e9e426]"
            onClick={handleAddProperty}>
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
