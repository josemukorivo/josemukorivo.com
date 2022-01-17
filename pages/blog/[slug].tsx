import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import Prism from 'prismjs';
import { BlogMenu } from '@components/blog';

import 'prismjs/themes/prism-okaidia.css';
import { Box, Container, Link, Text } from '@components/ui';

const Header = ({ date, title }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Box className='md:mb-16 max-w-3xl mx-auto'>
      <Text className='md:text-center text-slate-400 dark:text-slate-500 2xl:text-lg'>
        {new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>
      <Text
        as='h2'
        className='md:text-center normal-case font-body font-extrabold'
      >
        {title}
      </Text>
    </Box>
  );
};

export default function Home({ article }) {
  return (
    <>
      <Head>
        <title>Blog | {article?.title}</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content={article?.description} />
        <meta
          name='keywords'
          content='Joseph, Mukorivo, Joseph Mukorivo Blog, kubernetes, cloud computing,  react, server side rendering, ssr, ssg, performance, css, user experience'
        />
        <meta name='author' content='Joseph Mukorivo' />
        <meta name='image' content={article?.cover_image} />
        <meta name='og:title' content={article?.title} />
        <meta name='og:description' content={article?.description} />
        <meta name='og:image' content={article?.cover_image} />
        <meta name='og:url' content='https://josemukorivo.dev' />
        <meta name='og:site_name' content='Joseph Mukorivo' />
        <meta name='og:type' content='website' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={article?.title} />
        <meta name='twitter:alt' content={article?.title} />
        <meta name='twitter:description' content={article?.description} />
        <meta name='twitter:image' content={article?.cover_image} />
        <meta name='twitter:site' content='@josemukorivo' />
        <meta name='twitter:creator' content='@josemukorivo' />
      </Head>
      <BlogMenu />
      <Container className='mt-10 md:mt-20'>
        <Header date={article?.published_at} title={article?.title} />
        <Box className='mx-auto md:w-max'>
          <Box className='grid md:gap-10 md:grid-cols-[200px_auto] 2xl:grid-cols-[260px_auto]'>
            <Box className='text-base'>
              <Link
                href='/blog'
                className='hidden md:flex items-center pb-2 border-b dark:border-slate-700 hover:text-rose-500'
              >
                <MdOutlineKeyboardArrowLeft className='relative top-[-2px] mr-3' />{' '}
                Go back to blog
              </Link>

              <Box className='flex gap-4 items-center md:mt-5'>
                <Image
                  src={article?.user.profile_image}
                  height={45}
                  width={45}
                  className='rounded-full'
                  alt='Joseph Mukorivo'
                />
                <Box>
                  <Text className='mb-0 font-medium dark:text-slate-100'>
                    Joseph Mukorivo
                  </Text>
                  <Link
                    href='https://twitter.com/josemukorivo'
                    target='_blank'
                    className='text-rose-500 dark:text-rose-500'
                  >
                    @josemukorivo
                  </Link>
                </Box>
              </Box>

              <Text className='mt-8 dark:text-slate-200'>Tags:</Text>
              <Box className='flex flex-wrap mb-4 md:mb-0'>
                {article?.tags.map((tag) => (
                  <span
                    key={tag}
                    className='uppercase text-xs font-medium bg-slate-200 dark:bg-slate-800 py-1 px-2 rounded dark:text-slate-200 mr-2 mb-3'
                  >
                    #{tag}
                  </span>
                ))}
              </Box>
            </Box>
            {article && (
              <Box className='prose max-w-[89vw] md:max-w-[800px] md:min-w-[800px] 2xl:min-w-[960px] Code language-js dark:prose-invert prose-lg md:prose-xl 2xl:prose-lg'>
                <Box className='w-full h-56 md:h-96 relative'>
                  <Image
                    src={article?.cover_image}
                    alt=''
                    objectFit='cover'
                    layout='fill'
                  />
                </Box>

                <Box html={article?.body_html} className='mt-6' />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const res = await fetch(`https://dev.to/api/articles/josemukorivo/${slug}`);
  const article = await res.json();

  return {
    props: {
      article,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const res = await fetch('https://dev.to/api/articles?username=josemukorivo');
  const articles = await res.json();

  const paths = articles.map((article) => ({
    params: {
      slug: article.slug,
    },
  }));
  return {
    paths,
    fallback: false,
  };
}
