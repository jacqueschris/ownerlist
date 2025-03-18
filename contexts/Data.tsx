import axios from 'axios';
import { createContext, useState, useContext, ReactNode } from 'react';
import { useLocation } from '../hooks/useLocation';
import { DataContextType, Property } from '@/types';

// Create the context with a default value
const DataContext = createContext<DataContextType | undefined>(undefined);

// Type for the ThemeProvider props
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [tgData, setTGData] = useState<any>();
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>(30);
  const [properties, setProperties] = useState<Property[]>();

  let { location } = useLocation();

  async function register(data: any, skipRegister: boolean) {
    if (!skipRegister) {
      let res = await axios.post('/api/user/register', {
        username: data.user.username,
        token: window.Telegram.WebApp.initData,
        name: data.user.first_name,
      });
      if (res.status == 200) {
        setData({
          username: data.user.username,
          id: data.user.id,
          name: data.user.first_name,
        });
      }
    }
  }

  async function getUserData() {
    setIsLoading(true);
    let res = await axios.post('/api/user', { token: window.Telegram.WebApp.initData });
    setData(res.data.user);
    setIsLoading(false);
  }

  async function buy() {
    setIsLoading(true);
    let res = await axios.post('/api/payments/subscribe', {});
    setIsLoading(false);
    return res.data.invoiceLink;
  }

  const getProperties = async (token: string) => {
    try {
      let res = await axios.post(`/api/property/list`, { token });
      setProperties(res.data.properties);
    } catch (error) {
      console.error(error);
    }
  };

  const getFavorites = async (token: string, userId: string) => {
    try {
      let res = await axios.post(`/api/favorites/list`, { token, userId });

      console.log(res.data);
      if (res.data.favorites) {
        let favouritePropertyIds = res.data.favorites.map((favourite: any) => favourite.propertyId);
        setProperties(properties => (
          properties?.map(property => ({
            ...property,
            isFavorite: favouritePropertyIds.includes(property.id)
          })) || []
        ));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        register,
        getUserData,
        tgData,
        setTGData,
        isLoading,
        distance,
        setDistance,
        location,
        properties,
        setProperties,
        getProperties,
        getFavorites,
      }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DisplayProvider');
  }
  return context;
};
