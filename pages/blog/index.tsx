import { Blog } from '@components/sections';
import { SEO } from '@components/common';

export default function Home({ articles }) {
  return (
    <div>
      <SEO
        title='Joseph Mukorivo | Blog'
        description='Join people from around the world who share the same passion for Software Development, DevOps, and Cloud Computing.'
        image='https://josemukorivo.dev/images/me.jpeg'
      />
      <Blog articles={articles} />
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
