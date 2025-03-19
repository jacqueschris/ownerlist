import type { NextPage } from 'next';
import { useEffect } from 'react';

import { Layout } from '../components/layout';
import { useDataContext } from '@/contexts/Data';
import { useDisplayContext } from '@/contexts/Display';
import { get } from 'http';

const Home: NextPage = () => {
  const { getUserData, setTGData, getProperties, getFavorites, register, getViewings } = useDataContext();

  const { display } = useDisplayContext();

  useEffect(() => {
    (async () => {
      let data: any = parseQueryString(window.Telegram.WebApp.initData);
      if (data && data.user) {
        setTGData(data);
        await register(data, false)
        await getUserData(data.user.id);
        await getFavorites(window.Telegram.WebApp.initData, data.user.id);
        await getViewings(window.Telegram.WebApp.initData, data.user.id);

        //await getProperties(window.Telegram.WebApp.initData);
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
