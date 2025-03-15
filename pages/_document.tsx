import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import React from 'react'; // Import React

function MyDocument() {
  return (
    <Html>
      <Head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default MyDocument;
