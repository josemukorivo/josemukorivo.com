import Image from 'next/image';
import cn from 'classnames';
import { Box, Text, Link } from '@components/ui';
import s from './Card.module.scss';
import { formatDate } from '@utils/format-date';

export const Card = ({ slug, title, date, readingTime, coverImage }) => {
  return (
    <Link href={`/blog/${slug}`} className={cn(s.root, 'group')}>
      <Image
        src={coverImage}
        className={s.image}
        layout='fill'
        objectFit='cover'
        alt=''
      />
      <Box className={s.content}>
        <Text className='font-heading mb-4 text-3xl font-medium uppercase leading-[1.15] text-white md:text-4xl'>
          {title}
        </Text>
        <Box className='flex justify-between 2xl:mt-5'>
          <Text className='text-base font-medium text-white'>
            {readingTime} min read
          </Text>
          <Text className='text-base font-medium text-white'>
            {formatDate(date)}
          </Text>
        </Box>
      </Box>
    </Link>
  );
};
