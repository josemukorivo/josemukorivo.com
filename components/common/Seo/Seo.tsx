import Head from 'next/head';

export const SEO = ({ title, description, image, canonicalURL = '' }) => (
  <Head>
    <title>{title}</title>
    <link rel='icon' href='/favicon.ico' />
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
    <meta name='twitter:site' content='@josemukorivo' />
    <meta name='twitter:creator' content='@josemukorivo' />
    {canonicalURL && <link rel='canonical' href={canonicalURL} />}
  </Head>
);
