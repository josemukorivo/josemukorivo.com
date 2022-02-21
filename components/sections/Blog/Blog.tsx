import { BlogHero, Card } from '@components/blog';
import { Footer } from '@components/common';
import { Box, Button, Container, Text } from '@components/ui';

export const Blog = ({ articles }) => {
  return (
    <Box>
      <BlogHero />
      <Container className='grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-12 pb-12'>
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

      <Box className='bg-slate-50 mb-10 py-12 text-center'>
        <Container>
          <Text as='h2' className='font-medium mb-4'>
            Get in touch
          </Text>
          <Text className='mx-auto max-w-md opacity-75'>
            You have a project that you want to discuss? I&lsquo;d love to hear
            from you.
          </Text>
          <Box>
            <Button
              className='mt-4 font-heading uppercase mr-3'
              size='lg'
              variant='primary'
            >
              Get in touch
            </Button>
            <Button
              className='mt-4 font-heading uppercase'
              size='lg'
              variant='secondary'
            >
              Schedule a call
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};
