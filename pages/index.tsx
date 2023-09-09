import { Footer, Nav, Page } from '@components/common';
import {
  About,
  GetInTouch,
  Hero,
  LatestBlogs,
  TechStack,
} from '@components/sections';
import { Box } from '@components/ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { InlineWidget } from 'react-calendly';
import { VscChromeClose } from 'react-icons/vsc';

export default function Home({ articles }) {
  const [schedule, setSchedule] = useState(false);
  const router = useRouter();
  const { action } = router.query;

  useEffect(() => {
    if (action === 'schedule') {
      setSchedule(true);
    }
  }, [router, action]);

  return (
    <Page
      title='Joseph Mukorivo | Software Engineer'
      description='I am a Software Engineer, Blogger and DevOps Enthusiat based in Harare, Zimbabwe.'
      url='https://josemukorivo.com'
      keywords='Joseph, Mukorivo,Joseph Mukoriwo,Mukoriwo, software engineer,Blogger, Zimbabwe, Harare software developer, zimbabwe developer blog, software development blog, DevOps blog, Cloud Computing blog, React Developer, React Blog'
      image='https://josemukorivo.com/images/banner.jpg'
      canonicalURL='https://josemukorivo.com'
    >
      <Nav className='absolute py-3 md:py-5' />

      <Hero />
      <About />
      <LatestBlogs articles={articles} />
      <GetInTouch />
      <TechStack />
      <Footer />
      {schedule && (
        <Box className='fixed inset-0 z-30 bg-black bg-opacity-20 md:pt-20'>
          <button
            className='absolute right-8 top-7 flex items-center gap-2 md:right-12'
            onClick={() => setSchedule(false)}
          >
            <VscChromeClose className='h-8 w-auto transform text-white transition duration-300 ease-in-out hover:rotate-90 hover:text-rose-500' />
          </button>
          <InlineWidget
            url='https://calendly.com/josemukorivo'
            iframeTitle='Scheduling Page'
            pageSettings={{
              hideGdprBanner: true,
            }}
          />
        </Box>
      )}
    </Page>
  );
}

export async function getStaticProps() {
  const { NEXT_PUBLIC_DEV_TO_USERNAME } = process.env;
  const res = await fetch(
    `https://dev.to/api/articles?username=${NEXT_PUBLIC_DEV_TO_USERNAME}&state=all`
  );
  const articles = await res.json();

  return {
    props: {
      articles: articles.slice(0, 5),
    },
    revalidate: 60,
  };
}
