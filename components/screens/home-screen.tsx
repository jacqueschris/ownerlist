'use client';

import { useState } from 'react';
import { SearchBar } from '../ui/search-bar';
import { PropertyFilters } from '../property-filters';
import { PropertyGrid } from '../property-grid';
import { BottomNavigation } from '../bottom-navigation';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { AddPropertyScreen } from './add-property-screen';
import { useDisplayContext } from '@/contexts/Display';
import { useDataContext } from '@/contexts/Data';
import Header from '../header';

// Define a type for the filters
interface Filters {
  listingType: 'buy' | 'rent' | 'all';
  priceRange: [number, number];
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  size: [number, number];
  amenities: string[];
}

export function HomeScreen() {
  const { setDisplay, showAddPropertyButton, setShowAddPropertyButton } = useDisplayContext();
  const { properties } = useDataContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Initialize filters with default values
  const [filters, setFilters] = useState<Filters>({
    listingType: 'all',
    priceRange: [0, 1000000],
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    size: [0, 500],
    amenities: [],
  });

  if (!properties) {
    return <div>Loading...</div>;
  }
  // Apply all filters to properties
  const filteredProperties = properties!.filter((property) => {
    // Search query filter
    if (searchQuery && !property.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Listing type filter
    if (filters.listingType !== 'all' && property.listingType !== filters.listingType) {
      return false;
    }

    // Price range filter
    if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
      return false;
    }

    // Property type filter
    if (
      filters.propertyType &&
      property.propertyType.toLowerCase() !== filters.propertyType.toLowerCase()
    ) {
      return false;
    }

    // Bedrooms filter
    if (filters.bedrooms && property.bedrooms < Number.parseInt(filters.bedrooms)) {
      return false;
    }

    // Bathrooms filter
    if (filters.bathrooms && property.bathrooms < Number.parseInt(filters.bathrooms)) {
      return false;
    }

    // Size filter
    if (property.size < filters.size[0] || property.size > filters.size[1]) {
      return false;
    }

    // For amenities, we would need to add amenities to the Property type
    // This is a placeholder for when that data is available
    // if (filters.amenities.length > 0) {
    //   // Check if property has all selected amenities
    //   for (const amenity of filters.amenities) {
    //     if (!property.amenities?.includes(amenity)) {
    //       return false;
    //     }
    //   }
    // }

    return true;
  });

  console.log(filteredProperties);

  const handleAddProperty = () => {
    setDisplay(<AddPropertyScreen />);
    setShowAddPropertyButton(false);
  };

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setFiltersVisible(false);
    setShowAddPropertyButton(true);
  };

  const handleResetFilters = () => {
    setFilters({
      listingType: 'all',
      priceRange: [0, 1000000],
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      size: [0, 500],
      amenities: [],
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
        <div className="sticky top-0 z-10 bg-blue h-[68.5px] shadow-sm">
          <div className="p-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onFilterClick={handleFilterClick}
            />
          </div>
          {filtersVisible && (
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
            <PropertyGrid properties={filteredProperties} />
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
