import movexConfig from '@/movex.config';
import '@/styles/globals.css';
import { MovexProvider } from 'movex-react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    // This is similar to ReduxProvider. See https://react-redux.js.org/api/provider
    <MovexProvider movexDefinition={movexConfig} endpointUrl="localhost:3333">
      <Component {...pageProps} />
    </MovexProvider>
  );
}
