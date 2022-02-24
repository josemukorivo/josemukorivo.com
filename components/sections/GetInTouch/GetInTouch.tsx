import { Box, Button, Container, Text } from '@components/ui';

export const GetInTouch = () => (
  <Box className='mb-10 bg-slate-50  py-12 text-center dark:bg-[#0d1424]'>
    <Container>
      <Text as='h2' className='mb-4 font-medium'>
        Get in touch
      </Text>
      <Text className='mx-auto max-w-md opacity-75'>
        You have a cool project that you want to discuss? I&lsquo;d love to hear
        from you.
      </Text>
      <Box>
        <Button
          className='font-heading mt-4 mr-3 uppercase'
          size='lg'
          variant='primary'
        >
          Get in touch
        </Button>
        <Button
          className='font-heading mt-4 uppercase'
          size='lg'
          variant='secondary'
        >
          Schedule a call
        </Button>
      </Box>
    </Container>
  </Box>
);
