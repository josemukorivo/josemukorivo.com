import { useState, FormEvent, ChangeEvent } from 'react';
import MailchimpSubscribe from 'react-mailchimp-subscribe';

import { Text, Input, Button, Box } from '@components/ui';
import { motion } from 'framer-motion';

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
    <motion.form
      initial={{ opacity: 0 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1 }}
      onSubmit={handleSubmit}
    >
      <Text
        as='h5'
        casing='uppercase'
        fontWeight='medium'
        className='font-heading mb-4'
      >
        Stay up to date
      </Text>
      <Text className='mb-4 2xl:mb-8'>
        {status === 'success' ? (
          <span className='text-base font-bold text-green-500'>{message}</span>
        ) : (
          'Subscribe to my newsletter to stay up to date with articles, tips and much more!'
        )}
      </Text>
      <Input
        placeholder='Your name'
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
          className='prose prose-lg prose-rose mb-8 bg-rose-200 px-3 py-2 text-rose-900'
          html={message}
        />
      )}
      <Button
        variant='primary'
        type='submit'
        size='lg'
        disabled={status === 'sending' || status === 'success'}
        className='font-heading uppercase ring-offset-2'
      >
        {status === 'sending' ? 'Joining newsletter...' : 'Join the newsletter'}
      </Button>
      <Text className='mt-3' fontSize='sm'>
        *NB* I will not spam your inbox, and you can also unsubscribe at any
        time.
      </Text>
    </motion.form>
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
