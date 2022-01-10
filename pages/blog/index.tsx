import Head from 'next/head';
import { Blog } from '@components/sections';

export default function Home({ articles }) {
  return <Blog articles={articles} />;
}

export async function getStaticProps() {
  const res = await fetch('https://dev.to/api/articles?username=josemukorivo');
  const articles = await res.json();

  return {
    props: {
      articles,
    },
    revalidate: 60,
  };
}
