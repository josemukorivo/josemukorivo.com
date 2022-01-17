import Head from 'next/head';
import { Blog } from '@components/sections';

export default function Home({ articles }) {
  return (
    <div>
      <Head>
        <title>Joseph Mukorivo Blog</title>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='description'
          content='Join people from around the world who share the same passion for Software Development, DevOps, and Cloud Computing.'
        />
        <meta
          name='keywords'
          content='Joseph, Mukorivo, Joseph Mukorivo Blog, software engineer, Harare, Zimbabwe, Harare software developer, zimbabwe developer blog, software development blog, DevOps blog, Cloud Computing blog'
        />
        <meta name='author' content='Joseph Mukorivo' />
        <meta name='image' content='https://josemukorivo.dev/images/me.jpeg' />
        <meta name='og:title' content='Joseph Mukorivo Blog' />
        <meta
          name='og:description'
          content='Join people from around the world who share the same passion for Software Development, DevOps, and Cloud Computing.'
        />
        <meta
          name='og:image'
          content='https://josemukorivo.dev/images/me.jpeg'
        />
        <meta name='og:url' content='https://josemukorivo.dev' />
        <meta name='og:site_name' content='Joseph Mukorivo' />
        <meta name='og:type' content='website' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Joseph Mukorivo Blog' />
        <meta name='twitter:alt' content='Joseph Mukorivo Blog' />
        <meta
          name='twitter:description'
          content='Join people from around the world who share the same passion for Software Development, DevOps, and Cloud Computing.'
        />
        <meta
          name='twitter:image'
          content='https://josemukorivo.dev/images/me.jpeg'
        />
        <meta name='twitter:site' content='@josemukorivo' />
        <meta name='twitter:creator' content='@josemukorivo' />
      </Head>
      <Blog articles={articles} />;
    </div>
  );
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
