import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { FaUniversalAccess } from 'react-icons/fa';

import * as gtag from '../lib/gtag';
import { Layout } from '@components/common/Layout/Layout';
import '@styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Listen to route changes for Google Analytics
    const handleRouteChange = (url) => {
      gtag.pageview(url);
      NProgress.done();
    };

    router.events.on('routeChangeStart', () => NProgress.start());
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('routeChangeError', () => NProgress.done());
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', null);
      router.events.off('routeChangeError', null);
    };
  }, [router.events]);

  return (
    <Layout>
      <Component {...pageProps} />
      <div className='fixed bottom-8 right-8 z-30'>
        <button className='rounded-full bg-rose-500 p-2 text-white'>
          <FaUniversalAccess className='h-9 w-auto' />
        </button>
      </div>
    </Layout>
  );
}

export default MyApp;
