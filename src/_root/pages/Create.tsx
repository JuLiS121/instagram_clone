import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Label } from '../../components/ui/label';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignInValidation } from '@/lib/validation';
import { supabase } from '@/config/supabase';
import { v4 as uuidv4 } from 'uuid';
import { ChangeEvent, useState } from 'react';
import Loader from '@/components/shared/Loader';

const CDNURL =
  'https://ozffekhywobfzhaxhppb.supabase.co/storage/v1/object/public/media/';

const Create = ({
  changeBtn,
  username,
  setPost,
  setPostItem,
}: {
  setPostItem: (arg0: null | { creator: string; imageUrl: string }) => void;
  setPost: (arg0: boolean) => void;
  changeBtn: (arg0: string) => void;
  username: string;
}) => {
  const [image, setImage] = useState('');
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
        const fileType = mediaFile.type;

        if (fileType.startsWith('image/')) {
          endsWith = fileType.substring(6);
        }
        if (fileType.startsWith('video/')) {
          endsWith = fileType.substring(6);
        }
        const imageUrl = uuidv4() + '.' + endsWith.toLowerCase();
        setImage(imageUrl);
        const { error } = await supabase.storage
          .from('media')
          .upload(imageUrl, mediaFile);
        if (error) throw error;
        setPostItem({
          imageUrl: CDNURL + imageUrl,
          creator: username,
        });
        setPost(true);
      }
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
        changeBtn('');
      }}
      className='w-[100%] h-[100%] fixed bg-[rgba(0,0,0,0.5)]'
    >
      <div
        className='fixed top-0 bottom-10 left-0 right-0 lg:top-[50%] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%] bg-white rounded-[10px] lg:w-[420px] lg:h-[470px]'
        onClick={(e) => e.stopPropagation()}
      >
        <span
          onClick={() => {
            changeBtn('');
          }}
          className='text-black absolute font-bold cursor-pointer text-3xl top-0 right-2 lg:opacity-0 lg:right-[10000px]'
        >
          x
        </span>
        <Form {...form}>
          <form className='text-center w-full h-full'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex flex-col items-center mx-auto p-0'>
                      <span className='py-2 w-full font-semibold border-b-2 border-gray-200 mb-[110px]'>
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
                            changeBtn('');
                            setPostItem({ creator: username, imageUrl: image });
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
        onClick={() => changeBtn('')}
        className='fixed right-4 top-4 text-white w-10 h-7'
      >
        X
      </button>
    </div>
  );
};

export default Create;
