import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';

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
    </Layout>
  );
}

export default MyApp;
