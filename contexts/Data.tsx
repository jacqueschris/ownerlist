import axios from 'axios';
import { createContext, useState, useContext, ReactNode } from 'react';
import { useLocation } from '../hooks/useLocation';
import {
  DataContextType, Filters, Property, IncomingViewing,
  OutgoingViewing,
  Viewing,
  SearchAlert,
} from '@/types';

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
  const [favourites, setFavorites] = useState<Property[]>();
  const [listings, setListings] = useState<Property[]>();
  const [searchAlerts, setSearchAlerts] = useState<SearchAlert[]>([]);
  const [favouritesIds, setFavoritesIds] = useState<string[]>();
  const [incomingViewingRequests, setIncomingViewingRequests] = useState<IncomingViewing[]>();
  const [outgoingViewingRequests, setOutgoingViewingRequests] = useState<OutgoingViewing[]>();

  let { location } = useLocation();

  async function register(data: any, skipRegister: boolean) {
    try {
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
    catch (error) {
      console.error(error);
    }
  }

  async function getUserData() {
    let res = await axios.post('/api/user', { token: window.Telegram.WebApp.initData });
    setData(res.data.user);
  }

  async function buy() {
    let res = await axios.post('/api/payments/subscribe', {});
    return res.data.invoiceLink;
  }

  const getProperties = async (token: string, filters: Filters) => {
    try {
      let res = await axios.post(`/api/property/list`, { token, filters });
      if (res.status === 200 && res.data.properties) {
        setProperties(res.data.properties);
      } else {
        console.error('Error fetching properties:', res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getFavorites = async (token: string, userId: string) => {
    try {
      let res = await axios.post(`/api/favorites/list`, { token, userId });

      if (res.data.favorites) {
        let favouritePropertyIds = res.data.favorites.map((favourite: any) => favourite.property.id);
        setFavoritesIds(favouritePropertyIds)
        setFavorites(properties => (
          res.data.favorites?.map((property: any) => ({
            ...property.property,
            owner: { ...property.owner },
          })) || []
        ));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeFavourite = async (propertyId: string) => {
    let newFavourites = favourites?.filter((property: any) => property.id != propertyId)
    setFavorites(newFavourites)
    setFavoritesIds(newFavourites?.map((property: any) => property.id))
  }

  const addFavourite = async (propertyId: string) => {
    let newFavourites = [...favourites!]
    newFavourites.push(properties?.find((property: any) => property.id == propertyId)!)
    setFavorites(newFavourites)
    setFavoritesIds(newFavourites?.map((property: any) => property.id))
  }

  const updateProperty = async (newProperty: Property) => {
    if (properties) {
      let index = properties?.findIndex((property: any) => property.id == newProperty.id)

      if (index != -1) {
        let newProperties = [...properties!]
        let oldOwner = newProperties[index!].owner
        newProperty.owner = oldOwner
        newProperties[index!] = newProperty
        setProperties(newProperties)
      }
    }
    if (favourites) {
      let index = favourites?.findIndex((property: any) => property.id == newProperty.id)

      if (index != -1) {
        let newFavourites = [...favourites!]
        let oldOwner = newFavourites[index!].owner
        newProperty.owner = oldOwner
        newFavourites[index!] = newProperty
        setFavorites(newFavourites)
      }
    }
    if (listings) {
      let index = listings?.findIndex((property: any) => property.id == newProperty.id)

      if (index != -1) {
        let newListings = [...listings!]
        let oldOwner = newListings[index!].owner
        newProperty.owner = oldOwner
        newListings[index!] = newProperty
        setListings(newListings)
      }
    }

  }

  const deleteProperty = async (propertyId: string) => {
    let newProperties = properties?.filter((property: any) => property.id != propertyId)
    let newFavourites = favourites?.filter((property: any) => property.id != propertyId)
    let newListings = listings?.filter((property: any) => property.id != propertyId)
    setProperties(newProperties)
    setFavorites(newFavourites)
    setListings(newListings)
    setFavoritesIds(newFavourites?.map((property: any) => property.id))
  }

  const newListing = async (property: Property) => {
    let newListings = [...(listings || []), property] 
    setListings(newListings)
  }

  const getViewings = async (token: string, userId: string) => {
    try {
      let res = await axios.post(`/api/viewings/list`, { token, userId });

      if (res.data.viewings) {
        let incoming: IncomingViewing[] = [];
        let outgoing: OutgoingViewing[] = [];

        console.log(res.data.viewings);

        res.data.viewings.forEach((viewing: any) => {
          const newViewing: Viewing = {
            id: viewing.id,
            date: viewing.date,
            status: viewing.status,
            property: viewing.propertyDetails[0],
          };

          if (viewing.sourceUser === userId) {
            outgoing.push({
              viewing: newViewing,
              targetUser: viewing.targetUserDetails[0],
            } as OutgoingViewing);
          } else {
            incoming.push({
              viewing: newViewing,
              sourceUser: viewing.sourceUserDetails[0],
            } as IncomingViewing);
          }
        });

        setIncomingViewingRequests(incoming);
        setOutgoingViewingRequests(outgoing);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getListings = async (token: string) => {
    try {
      let res = await axios.get(`/api/user/listings`, {
        params: { token },
      });

      setListings(res.data.listings)
    } catch (error) {
      console.error(error);
    }
  };

  const getSearchAlerts = async (token: string) => {
    try {
      let res = await axios.get(`/api/alert/list`, {
        params: { token },
      });

      setSearchAlerts(res.data.searches)
    } catch (error) {
      console.error(error);
    }
  };

  const addSearchAlert = async (searchAlert: SearchAlert) => {
    let newSearchAlerts = [...(searchAlerts || []), searchAlert] 
    setSearchAlerts(newSearchAlerts)
  };

  const deleteSearchAlert = async (searchAlertId: string) => {
    let newSearchAlerts = searchAlerts?.filter((searchAlert: any) => searchAlert.id != searchAlertId)
    setSearchAlerts(newSearchAlerts)
  };
  
  const updateSearchAlert = async(newSearchAlert: SearchAlert) => {
    let index = searchAlerts?.findIndex((searchAlert: SearchAlert) => searchAlert.id == newSearchAlert.id)

    let newSearchAlerts = [...searchAlerts!]
    newSearchAlerts[index!] = newSearchAlert
    setSearchAlerts(newSearchAlerts)
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
        properties,
        setProperties,
        getProperties,
        getFavorites,
        favourites,
        favouritesIds,
        removeFavourite,
        addFavourite,
        updateProperty,
        deleteProperty,
        getViewings,
        incomingViewingRequests,
        setIncomingViewingRequests,
        outgoingViewingRequests,
        setOutgoingViewingRequests,
        listings,
        getListings,
        newListing,
        addSearchAlert,
        deleteSearchAlert,
        updateSearchAlert,
        getSearchAlerts,
        searchAlerts,
        setIsLoading
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
