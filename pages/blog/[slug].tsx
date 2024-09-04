import { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';

import { Box } from '@components/ui';
import { JsonLd, Page } from '@components/common';
import { BlogDetail, DetailImage } from '@components/blog';
import { Article, WithContext } from 'schema-dts';

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

  const articleSchema: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: title,
    description: description,
    image: socialImage,
    url: canonicalURL,
    datePublished: publishedAt,
    author: {
      "@type": "Person",
      name: "Joseph Mukorivo",
      url: "https://josemukorivo.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Joseph Mukorivo",
      url: "https://josemukorivo.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalURL,
    },
    articleBody: body,
    keywords: Array.from(new Set([...tags, ...blogKeywords])).join(', '),
   
  }

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
      <JsonLd>{articleSchema}</JsonLd>
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
