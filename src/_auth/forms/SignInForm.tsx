import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { SignInValidation } from '@/lib/validation/index';

import { signInWithEmail, signInWithFacebook } from '../../config/api';

function SignInForm({
  setToken,
}: {
  setToken: (arg0: string | undefined) => void;
}) {
  const navigate = useNavigate();
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    try {
      const data = await signInWithEmail(values.email, values.password);
      if (!data) throw Error;
      setToken(data.user.email);
      navigate('/');
      form.reset();
    } catch (error) {
      console.log(error);
    }
  }
  async function signWithFacebook() {
    try {
      await signInWithFacebook();
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Form {...form}>
      <div className='flex flex-col flex-wrap w-fit justify-center items-center md:border md:border-slate-400 md:p-6 py-10'>
        <img
          onClick={() => navigate(0)}
          src='/insta-pics/instagram.png'
          alt='Instagram Logo'
          className="w-[175px] h-[51px] bg-no-repeat inline-block bg-auto bg-[left_52px] font-bold text-5xl font-['Style_Script'] mb-5 mx-auto cursor-pointer"
        />
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
                  <Input placeholder='Email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='password' placeholder='Password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className='mt-5 w-72 h-[34px] bg-[#0095F5] hover:bg-[#1877F6] focus:bg-[#1877F6] active:bg-[#1877F6] transition'
            type='submit'
          >
            Log in
          </Button>
          <div className='flex justify-center items-center gap-4 my-4'>
            <hr className='w-[100px]' />
            <span className='text-slate-500 font-semibold text-xs mx-2 uppercase'>
              or
            </span>
            <hr className='w-[100px]' />
          </div>
          <div
            className='cursor-pointer mb-5 w-72 h-[34px] flex justify-center items-center'
            onClick={() => signWithFacebook()}
          >
            <img
              src='/insta-pics/facebook-logo.jpg'
              alt='facebook'
              className='h-4 mr-2'
            />
            <span className='text-[#385185] font-semibold text-sm'>
              Log in with Facebook
            </span>
          </div>
        </form>
      </div>
      <div className='mt-2 md:mt-4 flex h-8 justify-center items-center md:border md:border-slate-400 gap-3 py-7 mb-3 md:mb-0'>
        <span className='mr-1 text-sm'>
          Don't have an account?
          <Link
            className='text-[#0095F5] hover:text-[#1877F6] focus:text-[#1877F6] active:text-[#1877F6] transition ml-1'
            to='/sign-up'
          >
            Sign up
          </Link>
        </span>
      </div>
    </Form>
  );
}

export default SignInForm;
