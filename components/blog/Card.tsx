import Image from "next/legacy/image";
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
        placeholder='blur'
        blurDataURL='/images/blog-placeholder.png'
        className='bg-slate-50 transition duration-200 ease-in-out group-hover:scale-110 dark:bg-slate-800'
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
        fontWeight='medium'
        className='mb-1 mt-2 group-hover:underline md:hidden'
      >
        {title}
      </Text>
      <Text
        as='h3'
        fontWeight='medium'
        fontSize={variant === 'md' ? '3xl' : 'xl'}
        className='mb-1 mt-2 hidden group-hover:underline md:block'
      >
        {title}
      </Text>

      <Text as='p' className='hidden opacity-75 md:block'>
        {description}
      </Text>
    </Link>
  );
};
