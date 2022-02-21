import { About, Hero, LatestBlogs, TechStack } from '@components/sections';
import { Footer, SEO } from '@components/common';

export default function Home({ articles }) {
  return (
    <div>
      <SEO
        title='Joseph Mukorivo | Software Engineer'
        description='Joseph Mukorivo is a Software Engineer, Blogger and DevOps Enthusiat based in Harare, Zimbabwe.'
        image='https://josemukorivo.dev/images/me.jpeg'
      />
      <Hero />
      <About />
      <LatestBlogs articles={articles} />
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
