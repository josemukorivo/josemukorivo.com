import Image from 'next/image';
import { Box, Button, Text, Link } from '@components/ui';

export const Card = ({ title, date, readingTime, coverImage }) => {
  return (
    <Link
      href='/'
      className='block bg-slate-800 relative rounded md:rounded-none h-[350px] min-w-full md:min-w-[470px] 2xl:min-w-[630px] 2xl:h-[500px] mb-4 overflow-hidden group transition duration-500 ease-in-out dark:ring-offset-slate-900 hover:ring ring-rose-500 ring-offset-4 hover:scale-105'
    >
      <Image
        src={coverImage}
        className='transition duration-300 ease-in-out group-hover:scale-110'
        layout='fill'
        objectFit='cover'
        alt=''
      />
      <Button
        variant='naked'
        className='absolute hidden group-hover:inline-block ring-offset-rose-900 z-10 top-5 left-5 text-lg font-medium rounded'
      >
        Click to copy url
      </Button>

      <Box className='absolute text-white inset-0 flex flex-col justify-end p-5 bg-slate-900 bg-opacity-20 dark:bg-opacity-40'>
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
