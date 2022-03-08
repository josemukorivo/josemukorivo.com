import { About, Hero, LatestBlogs, TechStack } from '@components/sections';
import { Footer, Nav, Page } from '@components/common';

export default function Home({ articles }) {
  return (
    <Page
      title='Joseph Mukorivo | Software Engineer'
      description='Joseph Mukorivo is a Software Engineer, Blogger and DevOps Enthusiat based in Harare, Zimbabwe.'
      image='https://josemukorivo.dev/images/me.jpeg'
    >
      <Nav className='absolute py-3 md:py-5' />
      <Hero />
      <About />
      <LatestBlogs articles={articles} />
      <TechStack />
      <Footer />
    </Page>
  );
}

export async function getStaticProps() {
  const { NEXT_PUBLIC_DEV_TO_USERNAME } = process.env;
  const res = await fetch(
    `https://dev.to/api/articles?username=${NEXT_PUBLIC_DEV_TO_USERNAME}&per_page=5`
  );
  const articles = await res.json();

  return {
    props: {
      articles,
    },
    revalidate: 60,
  };
}
