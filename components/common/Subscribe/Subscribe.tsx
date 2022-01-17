import { useState, FormEvent, ChangeEvent } from 'react';
import MailchimpSubscribe from 'react-mailchimp-subscribe';

import { Text, Input, Button, Box } from '@components/ui';

const Form = ({ status, message, onValidated }) => {
  const [form, setForm] = useState({
    first_name: '',
    email: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, first_name: firstName } = form;
    const submitData = {
      EMAIL: email,
      MERGE1: firstName,
    };
    email && email.indexOf('@') > -1 && firstName && onValidated(submitData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Text as='h6' className='mt-10 font-heading uppercase font-medium'>
        Stay up to date
      </Text>
      <Text className='2xl:mb-8'>
        {status === 'success' ? (
          <span className='text-green-500 text-base font-bold'>{message}</span>
        ) : (
          'Subscribe to my newsletter to stay up to date with articles, tips and much more!'
        )}
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
      {status === 'error' && (
        <Box
          className='bg-rose-200 prose prose-lg prose-rose px-3 py-2 text-rose-900 mb-8'
          html={message}
        />
      )}
      <Button
        variant='primary'
        type='submit'
        size='lg'
        disabled={status === 'sending' || status === 'success'}
        className='uppercase font-heading ring-offset-2'
      >
        {status === 'sending' ? 'Sending...' : 'Sign me up'}
      </Button>
      <Text className='text-sm mt-3'>
        *NB* I will not spam your inbox, and you can also unsubscribe at any
        time.
      </Text>
    </form>
  );
};

export const Subscribe = () => {
  const API_URL = `https://dev.us20.list-manage.com/subscribe/post?u=${process.env.NEXT_PUBLIC_MAILCHIMP_USER}&id=${process.env.NEXT_PUBLIC_MAILCHIMP_ID}`;

  return (
    <MailchimpSubscribe
      url={API_URL}
      render={({ subscribe, status, message }) => (
        <Form
          status={status}
          message={message}
          onValidated={(formData) => subscribe(formData)}
        />
      )}
    />
  );
};
