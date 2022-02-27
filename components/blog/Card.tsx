import Image from 'next/image';
import { Box, Link, Text } from '@components/ui';
import { formatDate } from '@utils/format-date';

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
        <Text as='span' fontSize='sm' className='opacity-75'>
          {formatDate(date)}
        </Text>

        <Text as='span' fontSize='sm' className='opacity-75'>
          {readTime} min{readTime > 1 && 's'} read
        </Text>
      </Box>

      <Text
        as='h3'
        fontSize='lg'
        className='mb-1 mt-2 font-medium group-hover:underline md:hidden'
      >
        {title}
      </Text>
      <Text
        as='h3'
        fontSize={variant === 'md' ? '3xl' : 'xl'}
        className='mb-1 mt-2 hidden font-medium group-hover:underline md:block'
      >
        {title}
      </Text>

      <Text as='p' className='hidden opacity-75 md:block'>
        {description}
      </Text>
    </Link>
  );
};
