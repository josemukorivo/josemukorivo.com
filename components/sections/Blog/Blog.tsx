import { BlogHero, BlogSummary } from '@components/blog';
import { Box, Container } from '@components/ui';

export const Blog = ({ articles }) => {
  return (
    <Container>
      <BlogHero />
      <Box className='grid grid-cols-3 gap-8'>
        {articles.map(
          ({ id, title, published_at, description, cover_image }) => (
            <BlogSummary
              key={id}
              title={title}
              date={published_at}
              description={description}
              coverImage={cover_image}
            />
          )
        )}
      </Box>
    </Container>
  );
};
