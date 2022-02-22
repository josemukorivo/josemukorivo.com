import 'prismjs/themes/prism-okaidia.css';
import { useEffect } from 'react';
import Image from 'next/image';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import Prism from 'prismjs';

import { Box, Container, Link, Text } from '@components/ui';
import { Copyright, SEO } from '@components/common';
import { Card } from '@components/blog/Card';
import { formatDate } from '@utils/format-date';

const Blog = ({
  title,
  body,
  coverImage,
  tags,
  publishedAt,
  readTime,
  otherArticles,
}) => {
  return (
    <Box className='h-screen overflow-y-auto'>
      <Box className='sticky top-0 z-10 border-b bg-white backdrop-blur backdrop-filter dark:border-slate-700 dark:bg-slate-900 md:bg-opacity-80'>
        <Container className='py-5'>
          <Link
            href='/blog'
            className='font-heading relative -left-1 flex items-center text-xs uppercase hover:text-rose-500'
          >
            <MdOutlineKeyboardArrowLeft className='mr-1 h-4 w-auto' /> back to
            blog
          </Link>
        </Container>
      </Box>
      <Container className='mt-5'>
        <Text as='span' className='mb-2 block text-sm opacity-75'>
          {formatDate(publishedAt)} — {readTime} min{readTime > 1 && 's'} read
        </Text>
        <Text
          as='h2'
          className='mb-8 max-w-lg text-3xl font-medium md:text-4xl'
        >
          {title}
        </Text>

        <Box className='prose prose-lg prose-headings:font-heading prose-headings:uppercase prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-a:text-rose-600 Code language-js dark:prose-invert'>
          <Image src={coverImage} alt='' width={1000} height={420} />
          <Box className='mt-5 flex flex-wrap 2xl:mt-2'>
            {tags.map((tag) => (
              <span
                key={tag}
                className='mr-2 rounded bg-slate-200 py-1 px-2 text-xs font-medium uppercase dark:bg-slate-800 dark:text-slate-200'
              >
                #{tag}
              </span>
            ))}
          </Box>

          <Box html={body} />
        </Box>
      </Container>
      <Container className='my-6'>
        <Box className='border-t py-5'>
          <Text as='h4' className='font-heading my-2 font-medium uppercase'>
            You may love these ones
          </Text>
        </Box>
        <Box className='mb-16 grid grid-cols-2 gap-4'>
          {otherArticles.map(
            ({
              id,
              title,
              description,
              cover_image,
              published_at,
              slug,
              reading_time_minutes,
            }) => (
              <Card
                key={id}
                slug={slug}
                description={description}
                title={title}
                variant='sm'
                coverImage={cover_image}
                date={published_at}
                readTime={reading_time_minutes}
              />
            )
          )}
        </Box>
      </Container>
      <Copyright />
    </Box>
  );
};

export default function Home({ article, otherArticles }) {
  const {
    title,
    tags,
    description,
    body_html: body,
    cover_image: coverImage,
    social_image: socialImage,
    published_at: publishedAt,
    canonical_url: canonicalURL,
    reading_time_minutes: readTime,
  } = article;

  const randomizeArticles = () => {
    return otherArticles
      .sort((a: any, b: any) => 0.5 - Math.random())
      .slice(0, 2);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <>
      <SEO
        title={title}
        description={description}
        image={socialImage}
        canonicalURL={canonicalURL}
      />
      <Box className='grid h-screen overflow-hidden md:grid-cols-2'>
        <Box className='hidden h-screen overflow-hidden md:block'>
          <Box className='relative -z-[2] hidden h-full dark:block'>
            <Image
              src='/images/blog.jpg'
              alt=''
              quality={100}
              objectFit='cover'
              layout='fill'
              blurDataURL='/images/blog-placeholder.png'
              placeholder='blur'
              className='dark:blocke hidden'
            />
          </Box>
          <Box className='relative -z-[2] h-full dark:hidden'>
            <Image
              src='/images/blog-light.jpg'
              alt=''
              quality={100}
              objectFit='cover'
              layout='fill'
              blurDataURL='/images/blog-placeholder.png'
              placeholder='blur'
            />
          </Box>
        </Box>
        <Blog
          title={title}
          body={body}
          coverImage={coverImage}
          tags={tags}
          publishedAt={publishedAt}
          readTime={readTime}
          otherArticles={randomizeArticles()}
        />
      </Box>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const res = await fetch(`https://dev.to/api/articles/josemukorivo/${slug}`);
  const article = await res.json();

  const articlesRes = await fetch(
    'https://dev.to/api/articles?username=josemukorivo'
  );
  const articles = await articlesRes.json();
  const otherArticles = articles.filter((a: any) => a.slug !== slug);

  return {
    props: {
      article,
      otherArticles,
    },
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
