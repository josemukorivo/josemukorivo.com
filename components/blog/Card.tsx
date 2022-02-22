import { Box, Link, Text } from '@components/ui';
import { formatDate } from '@utils/format-date';
import Image from 'next/image';

export const Card = ({
  title,
  description,
  coverImage,
  date,
  slug,
  readTime,
  variant = 'md',
}) => {
  return (
    <Link href={`/blog/${slug}`} className='group block'>
      <Image
        src={coverImage}
        width={600}
        height={360}
        quality={100}
        objectFit='cover'
        className='transition duration-200 ease-in-out group-hover:scale-110'
        alt=''
      />

      <Box className='flex items-center justify-between'>
        <Text as='span' className='text-xs opacity-75 md:text-sm'>
          {formatDate(date)}
        </Text>

        <Text as='span' className='text-xs opacity-75 md:text-sm'>
          {readTime} min{readTime > 1 && 's'} read
        </Text>
      </Box>

      <Text
        as='h4'
        className={`mb-1 mt-2 text-base font-medium group-hover:underline ${
          variant === 'sm' ? 'md:text-xl' : 'md:text-3xl'
        }`}
      >
        {title}
      </Text>
      <Text as='p' className='hidden text-base opacity-75 md:block'>
        {description}
      </Text>
    </Link>
  );
};
