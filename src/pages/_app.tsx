// src/pages/_app.tsx
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppType } from 'next/dist/shared/lib/utils';
import { trpc } from '../utils/trpc';
import { useEffect } from 'react';

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    // add css class to html tag
    document.querySelector('html')!.classList.add('scroll-smooth');

    // add css class to body
    document.body.classList.add('dark:text-white');

    // set dark mode and persist it
    // if (
    //   localStorage.getItem('color-theme') === 'dark' ||
    //   (!('color-theme' in localStorage) &&
    //     window.matchMedia('(prefers-color-scheme: dark)').matches)
    // )
    //   document.documentElement.classList.add('dark');
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
