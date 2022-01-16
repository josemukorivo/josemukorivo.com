import { BlogHero, BlogSummary } from '@components/blog';
import { Box, Container } from '@components/ui';

export const Blog = ({ articles }) => {
  return (
    <Box>
      <BlogHero />
      <Container className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-7'>
        {articles.map(
          ({ id, title, published_at, reading_time_minutes, slug }) => (
            <BlogSummary
              key={id}
              slug={slug}
              title={title}
              date={published_at}
              readTime={reading_time_minutes}
            />
          )
        )}
      </Container>
    </Box>
  );
};
