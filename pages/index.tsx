import Head from 'next/head';
import { About, Hero, LatestBlogs, TechStack } from '@components/sections';
import { Footer } from '@components/common';

export default function Home({ articles }) {
  return (
    <div>
      <Head>
        <title>
          Hi 👋🏼, Im Joseph | Software Engineer | Writer | DevOps Enthusiast
        </title>
      </Head>
      <Hero />
      <LatestBlogs articles={articles} />
      <About />
      <TechStack />
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
