import Head from 'next/head';
import { About, Hero, LatestBlogs, TechStack } from '@components/sections';
import { Footer } from '@components/common';

export default function Home({ articles }) {
  return (
    <div>
      <Head>
        <title>Joseph Mukorivo | Software Engineer</title>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='description'
          content='Joseph Mukorivo is a software engineer based in Harare, Zimbabwe.'
        />
        <meta
          name='keywords'
          content='Joseph, Mukorivo, software engineer, Harare, Zimbabwe, Harare software developer, zimbabwe developer'
        />
        <meta name='author' content='Joseph Mukorivo' />
        <meta name='image' content='https://josemukorivo.dev/images/me.jpeg' />
        <meta name='og:title' content='Joseph Mukorivo | Software Engineer' />
        <meta
          name='og:description'
          content='Joseph Mukorivo is a software engineer based in Harare, Zimbabwe.'
        />
        <meta
          name='og:image'
          content='https://josemukorivo.dev/images/me.jpeg'
        />
        <meta name='og:url' content='https://josemukorivo.dev' />
        <meta name='og:site_name' content='Joseph Mukorivo' />
        <meta name='og:type' content='website' />
        <meta name='twitter:card' content='summary' />
        <meta
          name='twitter:title'
          content='Joseph Mukorivo | Software Engineer'
        />
        <meta
          name='twitter:description'
          content='Joseph Mukorivo is a software engineer based in Harare, Zimbabwe.'
        />
        <meta
          name='twitter:image'
          content='https://josemukorivo.dev/images/me.jpeg'
        />
        <meta name='twitter:site' content='@josemukorivo' />
        <meta name='twitter:creator' content='@josemukorivo' />
      </Head>
      <Hero />
      <About />
      <TechStack />
      <LatestBlogs articles={articles} />
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch(
    'https://dev.to/api/articles?username=josemukorivo&per_page=5'
  );
  const articles = await res.json();

  return {
    props: {
      articles,
    },
    revalidate: 60,
  };
}
