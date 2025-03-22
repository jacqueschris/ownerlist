import type { NextPage } from 'next';
import { useEffect } from 'react';

import { Layout } from '../components/layout';
import { useDataContext } from '@/contexts/Data';
import { useDisplayContext } from '@/contexts/Display';
import { get } from 'http';
import { toast } from '@/components/ui/use-toast';

const Home: NextPage = () => {
  const { getUserData, setTGData, setIsLoading, getFavorites, register, getViewings, getListings, getSearchAlerts } = useDataContext();

  const { display } = useDisplayContext();

  useEffect(() => {
    (async () => {
      try {
        let data: any = parseQueryString(window.Telegram.WebApp.initData);
        if (data && data.user) {
          setTGData(data);
          setIsLoading(true);
          await register(data, false)
          await getUserData(data.user.id);
          await getFavorites(window.Telegram.WebApp.initData, data.user.id);
          await getViewings(window.Telegram.WebApp.initData, data.user.id);
          await getListings(window.Telegram.WebApp.initData);
          await getSearchAlerts(window.Telegram.WebApp.initData);
          setIsLoading(false);

          //await getProperties(window.Telegram.WebApp.initData);
        }
      } catch (err) {
        toast({
          title: 'Failed to fetch data',
          description: 'Something went wrong while fetching your data, please refresh or reopen the app to try again.',
          variant: 'destructive',
        });
      }

    })();
  }, [window.Telegram.WebApp.initData]);

  function parseQueryString(queryString: string) {
    let params = new URLSearchParams(queryString);
    let result: any = {};

    for (let [key, value] of params.entries()) {
      try {
        result[key] = decodeURIComponent(value);
        // Attempt to parse JSON if the value is a valid JSON string
        if (result[key].startsWith('{') && result[key].endsWith('}')) {
          result[key] = JSON.parse(result[key]);
        }
      } catch (e) {
        console.error(`Error parsing key ${key}:`, e);
      }
    }

    return result;
  }

  return <Layout>{display}</Layout>;
};

export default Home;
