import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Label } from '../../components/ui/label';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignInValidation } from '@/lib/validation';
import { supabase } from '@/config/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { addPost } from '@/config/api';
import { ChangeEvent, useState } from 'react';
import Loader from './Loader';

const CDNURL =
  'https://ozffekhywobfzhaxhppb.supabase.co/storage/v1/object/public/media/';

const CreateProfile = ({
  changeBtn,
  username,
  setOpenCreate,
}: {
  setOpenCreate: (arg0: boolean) => void;
  changeBtn: (arg0: string) => void;
  username: string;
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
  async function uploadFile(e: ChangeEvent<HTMLInputElement>) {
    setLoading(true);
    try {
      const mediaFile = e?.target?.files?.[0];
      let endsWith = '';
      if (mediaFile) {
        // Get MIME type of the file
        const fileType = mediaFile.type;

        console.log('File type:', fileType, typeof fileType);

        // You can use the fileType information to determine if it's an image or video
        if (fileType.startsWith('image/')) {
          endsWith = fileType.substring(6);

          console.log('This is an image file.', endsWith);
          // Handle image file
        } else if (fileType.startsWith('video/')) {
          endsWith = fileType.substring(6);
          console.log('This is a video file.');
          // Handle video file
        } else {
          console.log('Unsupported file type.');
          // Handle other file types
        }
      }
      const imageUrl = uuidv4() + '.' + endsWith.toLowerCase();
      const { error } = await supabase.storage
        .from('media')
        .upload(imageUrl, mediaFile || '');
      console.log(mediaFile?.name);
      if (error) throw error;
      await addPost(CDNURL + imageUrl, username);
      changeBtn('');
      setOpenCreate(false);
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  if (loading) return <Loader />;

  return (
    <div
      onClick={() => {
        setOpenCreate(false);
      }}
      className='w-[100%] h-[100%] fixed bg-[rgba(0,0,0,0.5)]'
    >
      <div
        className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[10px]'
        onClick={(e) => e.stopPropagation()}
      >
        <Form {...form}>
          <form className='text-center w-[420px] h-[470px]'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex flex-col items-center w-[420px] h-[470px] mx-auto p-0'>
                      <span className='py-2 w-[420px] font-semibold border-b-2 border-gray-200 mb-[110px]'>
                        Create a new post
                      </span>
                      <div className='flex mb-2 items-center justify-center mr-7'>
                        <img
                          className='rotate-[-3deg] absolute'
                          src='/insta-pics/gallery.png'
                          alt='gallery'
                          width={60}
                          height={60}
                        />
                        <img
                          className='rotate-[3deg] relative top-2 left-8'
                          src='/insta-pics/play.png'
                          alt='play'
                          width={60}
                          height={60}
                        />
                      </div>
                      <span className='mt-3 text-[22px]'>
                        Drag photos and videos here
                      </span>
                      <Label className='text-center mt-5 max-w-[200px] bg-[#0094f6] py-1 px-2 rounded-lg text-center cursor-pointer hover:bg-[#1876f2]'>
                        <Input
                          type='file'
                          {...field}
                          className='opacity-0 w-0 h-0 z-[-1] overflow-hidden absolute'
                          onChange={(e) => {
                            uploadFile(e);
                          }}
                        />
                        <span className='font-bold text-white text-sm'>
                          Select from computer
                        </span>
                      </Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <button
        onClick={() => setOpenCreate(false)}
        className='fixed right-4 top-4 text-white w-10 h-7'
      >
        X
      </button>
    </div>
  );
};

export default CreateProfile;
