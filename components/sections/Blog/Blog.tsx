import { Box, Container, Text } from '@components/ui';
import { Card } from '@components/blog';
import { Footer } from '@components/common';
import { GetInTouch } from '..';

export const Blog = ({ articles }) => {
  return (
    <Box>
      <Container className='mt-20 mb-6 md:mt-24'>
        <Text as='h2' className='font-medium '>
          Blog
        </Text>
      </Container>
      <Container className='grid grid-cols-2 gap-4 pb-12 md:grid-cols-3 md:gap-x-6 md:gap-y-12 2xl:grid-cols-4'>
        {articles.map(
          ({
            id,
            title,
            description,
            cover_image,
            published_at,
            reading_time_minutes,
            slug,
          }) => (
            <Card
              key={id}
              slug={slug}
              description={description}
              title={title}
              coverImage={cover_image}
              date={published_at}
              readTime={reading_time_minutes}
            />
          )
        )}
      </Container>
      <GetInTouch />
      <Footer />
    </Box>
  );
};
