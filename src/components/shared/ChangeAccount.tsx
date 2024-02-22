import { SignInValidation } from '@/lib/validation';
import { Button } from '../ui/button';
import { FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmail } from '@/config/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loader from './Loader';

const ChangeAccount = ({
  setOpen,
  setToken,
}: {
  setOpen: (arg0: boolean) => void;
  setToken: (arg0: undefined | string) => void;
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    setLoading(true);
    try {
      const data = await signInWithEmail(values.email, values.password);
      if (!data) throw Error;
      if (data) {
        setToken(data.user.email);
        form.reset();
        setOpen(false);
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  if (loading) return <Loader />;
  return (
    <div
      className='w-[100%] h-[100%] fixed bg-[rgba(0,0,0,0.65)] z-40'
      onClick={() => {
        setOpen(false);
      }}
    >
      <div
        className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[10px] flex flex-col items-between w-full h-full md:w-[400px] md:h-[400px]'
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span
          className='cursor-pointer relative top-4 left-[370px]'
          onClick={() => setOpen(false)}
        >
          X
        </span>
        <img
          src='/insta-pics/instagram.png'
          alt='Instagram Logo'
          className='cursor-pointer bg-no-repeat mt-16 mb-12 mx-auto w-[45%]'
        />
        <Form {...form}>
          <div className='flex flex-col w-fit justify-center items-center mx-auto'>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-1 w-72'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Email'
                        {...field}
                        className='bg-gray-200 border border-gray-300 '
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Password'
                        {...field}
                        className='bg-gray-200 border border-gray-300'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className='mt-5 w-72 h-[34px] bg-[#0095F5] hover:bg-[#1877F6] focus:bg-[#1877F6] active:bg-[#1877F6] transition'
                type='submit'
              >
                Log in
              </Button>
            </form>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChangeAccount;
