import Head from 'next/head';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { Blog } from '@components/sections';
import { Box, Container, Link, Text } from '@components/ui';
import { Fragment } from 'react';
import Image from 'next/image';

const Header = ({ date, title }) => {
  return (
    <Box className='mb-16'>
      <Text className='text-center'>
        {new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>
      <Text as='h2' className='text-center font-bold'>
        {title}
      </Text>
    </Box>
  );
};

export default function Home({ article }) {
  return (
    <Container className='mt-10'>
      <Box className='mx-auto w-max'>
        <Header date={article?.published_at} title={article?.title} />
        <Box className='grid gap-10 grid-cols-[200px_auto]'>
          <Box>
            <Link
              href='/blog'
              className='flex items-center pb-2 border-b dark:border-slate-700'
            >
              <MdOutlineKeyboardArrowLeft className='relative top-[-2px] mr-3' />{' '}
              Go back to blog
            </Link>

            <Box className='flex gap-4 items-center mt-5'>
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
                  className='text-rose-500'
                >
                  @josemukorivo
                </Link>
              </Box>
            </Box>

            <Text className='mt-8 dark:text-slate-200'>Tags:</Text>
            <Box className='flex flex-wrap'>
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
            <Box className='prose prose-rose dark:prose-invert prose-xl'>
              <Box className='w-full h-80 relative'>
                <Image src={article?.cover_image} alt='' layout='fill' />
              </Box>

              <Box html={article?.body_html} className='mt-6' />
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export async function getStaticProps() {
  const res = await fetch(
    'https://dev.to/api/articles/josemukorivo/how-i-structure-my-nextjs-projects-5n8'
  );
  const article = await res.json();

  return {
    props: {
      article,
    },
    revalidate: 60,
  };
}
