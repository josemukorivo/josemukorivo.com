import { Container, Text, Link } from '@components/ui';

export const Copyright = () => (
  <Container className='flex flex-col justify-between border-t border-slate-300 py-5 dark:border-slate-700 md:flex-row'>
    <Text className='text-sm md:text-base'>
      Copyright © {new Date().getFullYear()} | All rights reserved.
    </Text>
    <Text className='text-sm md:text-base'>
      Made with ❤️ in Zimbabwe by{' '}
      <Link
        href='https://josemukorivo.dev'
        className='font-medium text-rose-500 hover:text-rose-600 dark:text-rose-500'
      >
        Joseph Mukorivo
      </Link>
      .
    </Text>
  </Container>
);
