import Image from 'next/image';
import cn from 'classnames';
import { Box, Button, Text, Link } from '@components/ui';
import s from './Card.module.scss';

export const Card = ({
  slug,
  title,
  date,
  readingTime,
  coverImage,
  color = '',
}) => {
  return (
    <Link href={`/blog/${slug}`} className={cn(s.root, 'group')}>
      <Image
        src={coverImage}
        className={s.image}
        layout='fill'
        objectFit='cover'
        alt=''
      />
      <Button
        variant='naked'
        className='absolute hidden md:group-hover:inline-block ring-offset-rose-900 z-10 top-5 left-5 text-lg font-medium rounded'
      >
        Click to copy url
      </Button>

      <Box className={cn(s.content, color)}>
        <Text className='text-3xl 2xl:text-4xl text-white font-bold'>
          {title}
        </Text>
        <Box className='flex justify-between 2xl:mt-5'>
          <Text className='text-white font-medium'>{readingTime} min read</Text>
          <Text className='text-white font-medium'>
            {new Date(date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </Box>
      </Box>
    </Link>
  );
};
