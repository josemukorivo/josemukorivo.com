import { useState } from 'react';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectCards } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-cards';

import { Box, Button, Card, Container, Link, Text } from '@components/ui';
import s from './Latest.module.scss';

SwiperCore.use([EffectCards]);

export const LatestBlogs = ({ articles }) => {
  const [x, setX] = useState(0);

  const translate = (pos) => {
    setX((prev) => prev + pos);
  };

  const colors = [
    'bg-cyan-900',
    'bg-slate-700',
    'bg-sky-900',
    'bg-teal-900',
    'bg-fuchsia-900',
  ];
  return (
    <Container full className={s.root} id='latest'>
      <Container className='mb-5'>
        <Box className='mb-7 flex items-center justify-between'>
          <Text as='h2' className='font-medium'>
            Latest Blogs
          </Text>
          <Link
            href='/blog'
            className='font-heading hidden text-sm font-medium uppercase md:block'
          >
            See the full blog
          </Link>
        </Box>
        <Text className='md:hidden'>
          Swipe left or right to see the latest articles or click{' '}
          <Link href='/blog' className='font-bold text-rose-500'>
            here
          </Link>{' '}
          to go to the blog.
        </Text>
      </Container>

      <Container className='md:hidden'>
        <Swiper effect={'cards'} grabCursor={true}>
          {articles?.length &&
            articles.map(
              (
                {
                  id,
                  slug,
                  title,
                  published_at,
                  reading_time_minutes,
                  cover_image,
                },
                idx
              ) => (
                <SwiperSlide key={id}>
                  <Card
                    slug={slug}
                    title={title}
                    date={published_at}
                    readingTime={reading_time_minutes}
                    coverImage={cover_image}
                  />
                </SwiperSlide>
              )
            )}
        </Swiper>
      </Container>

      <Box
        className='hidden w-[3000px] gap-x-10 pl-10 transition duration-500 ease-in-out md:flex'
        style={{ transform: `translate3d(${x}px, 0px, 0px)` }}
      >
        {articles?.length &&
          articles.map(
            ({
              id,
              slug,
              title,
              published_at,
              reading_time_minutes,
              cover_image,
            }) => (
              <Card
                key={id}
                slug={slug}
                title={title}
                date={published_at}
                readingTime={reading_time_minutes}
                coverImage={cover_image}
              />
            )
          )}
      </Box>
      <Container className='hidden md:block'>
        <Button
          className={s.arrows}
          size='sm'
          disabled={x === 0}
          onClick={() => translate(510)}
        >
          <MdArrowBackIosNew className='h-6 w-auto' />
        </Button>
        <Button
          className={s.arrows}
          disabled={x === -1530}
          size='sm'
          onClick={() => translate(-510)}
        >
          <MdArrowForwardIos className='h-6 w-auto' />
        </Button>
      </Container>
    </Container>
  );
};
