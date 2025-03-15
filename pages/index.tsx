import type { NextPage } from 'next';
import { useEffect } from 'react';

import { Layout } from '../components/layout';
import { HomeScreen } from '../components/screens/home-screen';
import { useDataContext } from '@/contexts/Data';
import { useDisplayContext } from '@/contexts/Display';

const Home: NextPage = () => {
  const { getUserData, setTGData } = useDataContext();
  const { display, bgColor } = useDisplayContext();

  useEffect(() => {
    let data: any = parseQueryString(window.Telegram.WebApp.initData);
    if (data && data.user) {
      setTGData(data);

      getUserData(data.user.id).then((data: any) => {});
    }
  }, [window.Telegram.WebApp.initData]);

  function parseQueryString(queryString: string) {
    let params = new URLSearchParams(queryString);
    let result = {};

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

  return (
    <Layout>
      <HomeScreen />
    </Layout>
  );
};

export default Home;
