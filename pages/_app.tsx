import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import initAuth from '../utils/initAuth';
import { Toaster } from 'react-hot-toast';

initAuth();

function MyApp({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            margin: '40px',
            background: '#363636',
            color: '#fff',
            zIndex: 1,
          },
          duration: 5000,
        }}
      />
    </>
  );
}

export default MyApp;
