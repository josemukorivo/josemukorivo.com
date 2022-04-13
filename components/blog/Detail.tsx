import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Box, Container, Text, Link } from '@components/ui';
import { Copyright, Nav } from '@components/common';
import { formatDate } from '@utils/format-date';
import { OtherArticles } from '@components/blog';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { motion } from 'framer-motion';
import {
  TwitterShareButton,
  LinkedinShareButton,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';

const Badge = ({ children }) => (
  <span className='mr-2 mb-2 rounded bg-slate-200 py-1 px-2 text-xs font-medium uppercase dark:bg-slate-800 dark:text-slate-200'>
    {children}
  </span>
);

const Prose = ({ children }) => (
  <Box className='prose prose-lg prose-headings:font-heading prose-headings:uppercase prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-a:text-rose-600 Code language-js dark:prose-invert'>
    {children}
  </Box>
);

const Share = ({ url, title }) => (
  <Box className='flex items-center gap-2'>
    <Text as='span' fontSize='sm' className='relative top-[2px] opacity-75'>
      Share:
    </Text>
    <TwitterShareButton title={title} related={['josemukorivo']} url={url}>
      <TwitterIcon size={23} round />
    </TwitterShareButton>
    <LinkedinShareButton
      title={title}
      url={url}
      summary={title}
      source='josemukorivo'
    >
      <LinkedinIcon size={23} round />
    </LinkedinShareButton>
  </Box>
);

const Header = ({ slug, title, readTime, publishedAt }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [title]);
  return (
    <div ref={ref}>
      <Link
        href='/blog'
        className='font-heading relative -left-[7px] mt-4 mb-5 flex items-center text-xs uppercase hover:text-rose-500 md:hidden'
      >
        <MdOutlineKeyboardArrowLeft className='mr-1 h-4 w-auto' /> back to blog
      </Link>
      <Box className='flex items-center justify-between'>
        <Text as='span' fontSize='sm' className='mb-2 block opacity-75 md:pt-5'>
          <motion.span
            className='block'
            initial={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {formatDate(publishedAt)} — {readTime} min{readTime > 1 && 's'} read
          </motion.span>
        </Text>
        <Share url={`https://josemukorivo.com/blog/${slug}`} title={title} />
      </Box>
      <Text as='h1' fontSize='4xl' className='mb-8 max-w-lg'>
        <motion.span
          className='block'
          initial={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {title}
        </motion.span>
      </Text>
    </div>
  );
};

export const BlogDetail = ({
  slug,
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
      <Nav variant='blog' />
      <Container className=''>
        <Header
          title={title}
          readTime={readTime}
          slug={slug}
          publishedAt={publishedAt}
        />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.9 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Prose>
            <Image src={coverImage} alt='' width={1000} height={420} />
            <Box className='mt-5 flex flex-wrap 2xl:mt-2'>
              {tags.map((tag) => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </Box>
            <Box html={body} />
          </Prose>
        </motion.div>
      </Container>
      <OtherArticles otherArticles={otherArticles} />
      <Copyright />
    </Box>
  );
};
