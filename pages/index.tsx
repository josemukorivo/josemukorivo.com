import { Footer, JsonLd, Nav, Page } from '@components/common';
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
import { WithContext, Person, WebPage } from 'schema-dts';

export default function Home({ articles }) {
  const [schedule, setSchedule] = useState(false);
  const router = useRouter();
  const { action } = router.query;

  useEffect(() => {
    if (action === 'schedule') {
      setSchedule(true);
    }
  }, [router, action]);

  const personSchema: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Joseph Mukorivo",
    url: "https://josemukorivo.com",
    sameAs: [
      "https://twitter.com/josemukorivo",
      "https://github.com/josemukorivo",
      "https://linkedin.com/in/josemukorivo"
    ],
    description: "Software Engineer, Blogger, and DevOps Enthusiast from Harare, Zimbabwe.",
    image: "https://josemukorivo.com/images/banner.jpg",
    mainEntity: [
      {
        "@type": "Person",
        name: "Joseph Mukorivo",
        url: "https://josemukorivo.com",
        image: "https://josemukorivo.com/images/banner.jpg",
        sameAs: [
          "https://twitter.com/josemukorivo",
          "https://github.com/josemukorivo",
          "https://linkedin.com/in/josemukorivo"
        ],
        description: "Software Engineer, Blogger, and DevOps Enthusiast from Harare, Zimbabwe.",
        jobTitle: "Software Engineer",
        worksFor: {
          "@type": "Organization",
          name: "Complexus Technologies",
          url: "https://complexus.tech"
        },
        knowsAbout: [
          "Software Development",
          "DevOps",
          "Cloud Computing",
          "React",
          "Node.js",
          "Full-stack Development",
          "Web Development",
          "Cloud Services",
          "Next.js",
          "A/B Testing",
        ],
        email: "hello@josemukorivo.com",
      },
      {
        "@type": "Question",
        name: "What services does Joseph Mukorivo offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "I offer web application development services, specializing in Next.js and Golang applications."
        }
      },
      {
        "@type": "Question",
        name: "What is Joseph's experience in software development?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "I have more than 5 years of experience in software development, with a focus on full-stack web applications and cloud technologies."
        }
      },
      {
        "@type": "Question",
        name: "Does Joseph Mukorivo take on freelance projects?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "When I have the time, I'm open to taking on freelance projects. Please use the contact form or schedule a call to discuss your project requirements."
        }
      }
    ]
  }

  return (
    <Page
      title='Joseph Mukorivo | Software Engineer'
      description='I am a Software Engineer, Blogger and DevOps Enthusiast from Harare, Zimbabwe.'
      url='https://josemukorivo.com'
      keywords='Joseph, Mukorivo,Joseph Mukoriwo, Mukoriwo, software engineer,Blogger, Zimbabwe, Harare software developer, zimbabwe developer blog, software development blog, DevOps blog, Cloud Computing blog, React Developer, React Blog'
      image='https://josemukorivo.com/images/banner.jpg'
      canonicalURL='https://josemukorivo.com'
    >
      <JsonLd>{personSchema}</JsonLd>
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
    `https://dev.to/api/articles?username=${NEXT_PUBLIC_DEV_TO_USERNAME}&state=fresh`
  );
  const articles = await res.json();

  return {
    props: {
      articles: articles.slice(0, 5),
    },
    revalidate: 60,
  };
}
