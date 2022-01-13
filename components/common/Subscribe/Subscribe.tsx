import { Text, Input, Button } from '@components/ui';
import s from './Subscribe.module.scss';

export const Subscribe = () => {
  return (
    <form>
      <Text as='h6' className='mt-10 font-heading uppercase font-medium'>
        Stay up to date
      </Text>
      <Text className='2xl:mb-8'>
        Subscribe to my newsletter to stay up to date with articles, tips and
        much more!
      </Text>
      <Input placeholder='Joseph' label='First name *' required />
      <Input
        placeholder='you@example.com'
        type='email'
        label='Email *'
        required
      />

      <Button
        variant='primary'
        type='submit'
        size='lg'
        className='uppercase font-heading ring-offset-2'
      >
        Sign me up
      </Button>
      <Text className='text-sm mt-3'>
        *NB* I will not spam your inbox, and you can also unsubscribe at any
        time.
      </Text>
    </form>
  );
};
