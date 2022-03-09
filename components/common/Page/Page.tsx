import { FC } from 'react';
import Head from 'next/head';

interface Props {
  title: string;
  description: string;
  image: string;
  canonicalURL?: string;
}

export const Page: FC<Props> = ({
  children,
  title,
  description,
  image,
  canonicalURL,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta
          name='keywords'
          content='Joseph, Mukorivo, Joseph Mukorivo, software engineer, Harare, Zimbabwe, Harare software developer, zimbabwe developer blog, software development blog, DevOps blog, Cloud Computing blog, React Developer, React Blog'
        />
        <meta name='author' content='Joseph Mukorivo' />
        <meta name='image' content={image} />
        <meta name='og:title' content={title} />
        <meta name='og:description' content={description} />
        <meta name='og:image' content={image} />
        <meta name='og:url' content='https://josemukorivo.dev' />
        <meta name='og:site_name' content='Joseph Mukorivo' />
        <meta name='og:type' content='website' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:alt' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={image} />
        <meta name='theme-color' content='#0f172a' />
        <meta
          name='theme-color'
          content='#0f172a'
          media='(prefers-color-scheme: dark)'
        />
        <meta
          name='theme-color'
          content='#ffffff'
          media='(prefers-color-scheme: light)'
        />
        <meta name='twitter:site' content='@josemukorivo' />
        <meta name='twitter:creator' content='@josemukorivo' />
        {canonicalURL && <link rel='canonical' href={canonicalURL} />}
      </Head>
      <main>{children}</main>
    </>
  );
};
