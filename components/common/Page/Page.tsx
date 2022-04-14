import { FC } from 'react';
import Head from 'next/head';
import { useTheme } from 'hooks';

interface Props {
  title: string;
  url: string;
  type?: string;
  keywords: string;
  description: string;
  image: string;
  canonicalURL?: string;
}

export const Page: FC<Props> = ({
  children,
  title,
  type = 'website',
  url,
  keywords,
  description,
  image,
  canonicalURL,
}) => {
  const { theme } = useTheme();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
        <meta name='author' content='Joseph Mukorivo' />
        <meta name='image' content={image} />
        <meta name='og:title' content={title} />
        <meta name='og:description' content={description} />
        <meta name='og:image' content={image} />
        <meta name='og:url' content={url} />
        <meta name='og:site_name' content='Joseph Mukorivo' />
        <meta name='og:type' content={type} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:alt' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={image} />
        <meta
          name='theme-color'
          content={theme === 'dark' ? '#0f172a' : '#ffffff'}
        />
        <meta name='twitter:site' content='@josemukorivo' />
        <meta name='twitter:creator' content='@josemukorivo' />
        {canonicalURL && <link rel='canonical' href={canonicalURL} />}
      </Head>
      <main>{children}</main>
    </>
  );
};
