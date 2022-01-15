import { useState } from 'react';

import { Text, Input, Button } from '@components/ui';

export const Subscribe = () => {
  const [form, setForm] = useState({
    first_name: '',
    email: '',
  });

  const API_KEY = '3k-JJ_9KdDdWYNiOyeeMOA';
  const API_URL = 'https://api.convertkit.com/v3/';
  const FORM_ID = 2009145;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const URL = `${API_URL}forms/${FORM_ID}/subscribe`;
    const data = {
      ...form,
      api_key: API_KEY,
    };
    fetch(URL, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Text as='h6' className='mt-10 font-heading uppercase font-medium'>
        Stay up to date
      </Text>
      <Text className='2xl:mb-8'>
        Subscribe to my newsletter to stay up to date with articles, tips and
        much more!
      </Text>
      <Input
        placeholder='Joseph'
        name='first_name'
        onChange={handleChange}
        label='First name *'
        required
      />
      <Input
        placeholder='you@example.com'
        name='email'
        onChange={handleChange}
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
