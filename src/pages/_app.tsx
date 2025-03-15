import '../styles/globals.css';

import axios from 'axios';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';

import { Poppins } from 'next/font/google';
import { DataProvider } from '../contexts/Data';
import { DisplayProvider } from '../contexts/Display';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

function MyApp({ Component, pageProps }: AppProps) {
  const [isHashValid, setIsHashValid] = useState(false);

  // Wait for validation to complete before rendering the page and stop the
  // rendering if the hash is invalid. Comment out the following useEffect
  // hook to see the page render without the hash validation.
  useEffect(() => {
    axios
      .post('/api/validate-hash', { hash: window.Telegram.WebApp.initData })
      .then((response) => setIsHashValid(response.status === 200));
  }, []);

  if (!isHashValid) {
    return null;
  }

  return (
    <DisplayProvider>
      <DataProvider>
        <div className={poppins.className}>
          <Component {...pageProps} />
        </div>
      </DataProvider>
    </DisplayProvider>
  );
}

export default MyApp;
