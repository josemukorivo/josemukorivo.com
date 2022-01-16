import { Box, Link, Text } from '@components/ui';

export const BlogSummary = ({ title, date, slug, readTime }) => {
  return (
    <Link
      href={`/blog/${slug}`}
      className='block bg-slate-200 dark:bg-slate-800 rounded-lg relative h-[170px] md:h-[300px] 2xl:h-[400px] overflow-hidden group transition duration-500 ease-in-out dark:ring-offset-slate-900 hover:ring ring-rose-500 ring-offset-4'
    >
      <Box className='absolute dark:text-white inset-0 flex flex-col justify-between p-3 py-4 md:p-5'>
        <Box className='flex justify-between 2xl:mt-5'>
          <Text className='hidden md:block text-slate-600 text-sm md:text-base 2xl:text-lg dark:text-slate-400 font-medium'>
            {readTime} min read
          </Text>
          <Text className='text-slate-600 text-sm md:text-base 2xl:text-lg dark:text-slate-400 font-medium'>
            {new Date(date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </Box>
        <Text className='text-lg md:text-3xl 2xl:text-4xl dark:text-white font-extrabold mb-0'>
          {title}
        </Text>
      </Box>
    </Link>
  );
};
