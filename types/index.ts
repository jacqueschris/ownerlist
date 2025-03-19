import { ReactNode } from 'react';

export interface DataContextType {
  data: any;
  isLoading: boolean;
  tgData: any;
  setTGData: React.Dispatch<React.SetStateAction<any>>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  register: (data: any, skipRegister: boolean) => Promise<void>;
  getUserData: (id: string) => Promise<any>;
  distance: number;
  setDistance: React.Dispatch<React.SetStateAction<number>>;
  location: any;
  properties?: Property[];
  favourites?: Property[];
  favouritesIds?: string[];
  setProperties: React.Dispatch<React.SetStateAction<Property[] | undefined>>;
  getProperties: (token: string, filters: Filters) => Promise<void>;
  getFavorites: (token: string, userId: string) => Promise<void>;
  removeFavourite: (propertyId: string) => Promise<void>;
  addFavourite: (propertyId: string) => Promise<void>;
  updateProperty: (newProperty: Property) => Promise<void>;
  deleteProperty: (propertyId: string) => Promise<void>;
}

export interface DisplayContextType {
  display: ReactNode;
  setDisplay: React.Dispatch<React.SetStateAction<ReactNode>>;
  bgColor: string;
  setBgColor: React.Dispatch<React.SetStateAction<string>>;
  showButtons: boolean;
  setShowButtons: React.Dispatch<React.SetStateAction<boolean>>;
  showAddPropertyButton: boolean;
  setShowAddPropertyButton: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PropertyOwner {
  username: string;
  name: string;
  id: string;
}

export interface TimeSlotAvailability {
  start: string;
  end: string;
}

export interface DayAvailability {
  day: string;
  timeSlots: TimeSlotAvailability[];
}

export interface CarSpace {
  type: 'garage' | 'carspace';
  capacity: number;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  propertyType: string;
  bedrooms: number;
  locality: string;
  position: number[];
  amenities: string[];
  images: string[];
  owner: PropertyOwner;
  bathrooms: number;
  size: number;
  image: string;
  isFavorite: boolean;
  carSpaces: CarSpace[];
  availabilitySchedule: DayAvailability[];
  listingType: 'buy' | 'rent';
}

// Define a type for the filters
export interface Filters {
  listingType: 'buy' | 'rent' | 'all';
  priceRange: [number, number];
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  size: [number, number];
  amenities: string[];
  locality: string[];
}