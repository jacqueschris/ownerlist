import axios from 'axios';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useLocation } from '../hooks/useLocation';
import { DataContextType } from '../types';
import { useDisplayContext } from './Display';

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
  const { setDisplay } = useDisplayContext();
  let { location } = useLocation();

  async function register(data: any, skipRegister: boolean) {
    if (!skipRegister) {
      let res = await axios.post('/api/register', {
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

    setDisplay(<div />);
  }

  async function getUserData(id: string) {
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
      }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
