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

import { SignUpValidation } from '../../lib/validation/index';

import { addUser, signInWithFacebook, signUpNewUser } from '@/config/api';

function SignUpForm() {
  const navigate = useNavigate();
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      username: '',
      fullName: '',
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    try {
      await signUpNewUser(values.email, values.password);
      form.reset();
      await addUser(
        values.email,
        values.password,
        values.username,
        values.fullName
      );
      navigate('/sign-in');
    } catch (err) {
      console.log(err);
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
      <div className='flex flex-col w-fit md:w-3/4 justify-center items-center md:border md:border-slate-400 md:p-6 py-10 md:ml-20'>
        <img
          onClick={() => navigate(0)}
          src='/insta-pics/instagram.png'
          alt='Instagram Logo'
          className="w-[175px] h-[51px] bg-no-repeat inline-block bg-auto bg-[left_52px] font-bold text-5xl font-['Style_Script'] mb-5 mx-auto cursor-pointer"
        />
        <span className='text-slate-500 font-semibold mb-5 text-center'>
          Sign up to see photos and videos from your friends.
        </span>

        <Button
          className='mb-5 w-72 h-[34px] bg-[#0095F5] hover:bg-[#1877F6] focus:bg-[#1877F6] active:bg-[#1877F6] transition'
          onClick={() => signWithFacebook()}
        >
          <img
            src='/insta-pics/facebook-logo-1.png'
            alt='facebook'
            className='h-4 mr-2'
          />
          Log in with Facebook
        </Button>
        <div className='flex justify-center items-center gap-4 mb-4'>
          <hr className='w-[100px]' />
          <span className='text-slate-500 font-semibold text-xs mx-2 uppercase'>
            or
          </span>
          <hr className='w-[100px]' />
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-1'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder='Email' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Full Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Username' {...field} />
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
                  <Input {...field} placeholder='Password' type='password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className='mt-5 w-72 h-[34px] bg-[#0095F5] hover:bg-[#1877F6] focus:bg-[#1877F6] active:bg-[#1877F6] transition'
            type='submit'
          >
            Next
          </Button>
        </form>
      </div>
      <div className='mt-1 md:mt-3 w-3/4 flex h-8 justify-center items-center md:border md:border-slate-400 px-auto gap-3 py-3 md:py-7 ml-12 md:ml-20 mb-5 md:mb-0'>
        <span className='mr-1 text-sm'>
          Have an account?
          <Link
            className='text-[#0095F5] hover:text-[#1877F6] focus:text-[#1877F6] active:text-[#1877F6] transition ml-1'
            to='/sign-in'
          >
            Log in
          </Link>
        </span>
      </div>
    </Form>
  );
}

export default SignUpForm;
