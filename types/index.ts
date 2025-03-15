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

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  image: string;
  isFavorite: boolean;
  listingType: 'buy' | 'rent';
}
