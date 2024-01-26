import { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';

import { Box } from '@components/ui';
import { Page } from '@components/common';
import { BlogDetail, DetailImage } from '@components/blog';

export default function Home({ article, otherArticles }) {
  const {
    slug,
    title,
    tags,
    description,
    body_html: body,
    cover_image: coverImage,
    social_image: socialImage,
    published_at: publishedAt,
    canonical_url: canonicalURL,
    reading_time_minutes: readTime,
  } = article;

  const blogKeywords =
    'software, coding, development, engineering, inclusive, community, joseph mukorivo, software engineer, react developer'.split(
      ', '
    );

  const randomizeArticles = () => {
    return otherArticles
      .sort((a: any, b: any) => 0.5 - Math.random())
      .slice(0, 2);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [slug]);

  return (
    <Page
      title={title}
      url={canonicalURL}
      type='article'
      keywords={Array.from(new Set([...tags, ...blogKeywords])).join(', ')}
      description={description}
      image={socialImage}
      canonicalURL={canonicalURL}
    >
      <Box className='grid h-screen overflow-hidden md:grid-cols-2'>
        <DetailImage coverImage={coverImage} />
        <BlogDetail
          title={title}
          body={body}
          coverImage={coverImage}
          slug={slug}
          tags={tags}
          publishedAt={publishedAt}
          readTime={readTime}
          otherArticles={randomizeArticles()}
        />
      </Box>
    </Page>
  );
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const { NEXT_PUBLIC_DEV_TO_USERNAME } = process.env;
  const res = await fetch(
    `https://dev.to/api/articles/${NEXT_PUBLIC_DEV_TO_USERNAME}/${slug}`
  );
  const article = await res.json();

  const articlesRes = await fetch(
    `https://dev.to/api/articles?username=${NEXT_PUBLIC_DEV_TO_USERNAME}&state=fresh`
  );
  const articles = await articlesRes.json();
  const otherArticles = articles.filter((a: any) => a.slug !== slug);

  return {
    props: {
      article,
      otherArticles,
    },
  };
}

export async function getStaticPaths() {
  const { NEXT_PUBLIC_DEV_TO_USERNAME } = process.env;
  const res = await fetch(
    `https://dev.to/api/articles?username=${NEXT_PUBLIC_DEV_TO_USERNAME}&state=fresh`
  );
  const articles = await res.json();
  console.log(articles);

  const paths = articles.map((article) => ({
    params: {
      slug: article.slug,
    },
  }));
  return {
    paths,
    fallback: false,
  };
}
