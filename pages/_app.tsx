import React from 'react'
import type { AppProps } from 'next/app';
import '../styles/globals.css'
import initAuth from '../utils/initAuth'

initAuth()

function MyApp({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />
}

export default MyApp
