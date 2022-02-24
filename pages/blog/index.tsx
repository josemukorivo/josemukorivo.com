import { Blog } from '@components/sections';
import { Nav, Page} from '@components/common';

export default function Home({ articles }) {
  return (
      <Page
        title='Joseph Mukorivo | Blog'
        description='Join people from around the world who share the same passion for Software Development, DevOps, and Cloud Computing.'
        image='https://josemukorivo.dev/images/me.jpeg'
      >
      <Nav className='fixed border-b bg-white bg-opacity-75 py-3 backdrop-blur dark:bg-slate-900' />
      <Blog articles={articles} />
      </Page>
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
