import { Box, Container, Text } from '@components/ui';
import { Card } from '@components/blog/Card';

export const OtherArticles = ({ otherArticles }) => (
  <Container className='my-6'>
    <Box className='border-t py-5'>
      <Text as='h4' className='font-heading my-2 font-medium uppercase'>
        You may love these ones
      </Text>
    </Box>
    <Box className='mb-16 grid grid-cols-2 gap-4'>
      {otherArticles.map(
        ({
          id,
          title,
          description,
          cover_image,
          published_at,
          slug,
          reading_time_minutes,
        }) => (
          <Card
            key={id}
            slug={slug}
            description={description}
            title={title}
            variant='sm'
            coverImage={cover_image}
            date={published_at}
            readTime={reading_time_minutes}
          />
        )
      )}
    </Box>
  </Container>
);
