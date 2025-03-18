import { ReactNode } from 'react';

export interface DataContextType {
  data: any;
  isLoading: boolean;
  tgData: any;
  setTGData: React.Dispatch<React.SetStateAction<any>>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  register: (data: any, skipRegister: boolean) => void;
  getUserData: (id: string) => any;
  distance: number;
  setDistance: React.Dispatch<React.SetStateAction<number>>;
  location: any;
  properties?: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[] | undefined>>;
  getProperties: (token: string) => Promise<void>;
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

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  propertyType: string;
  bedrooms: number;
  position: number[];
  amenities: string[];
  images: string[];
  owner: PropertyOwner;
  bathrooms: number;
  size: number;
  image: string;
  isFavorite: boolean;
  listingType: 'buy' | 'rent';
}
