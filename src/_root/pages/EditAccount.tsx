import { getBio, getUserProfilePc, updateBio } from '@/config/api';
import { Avatar } from '@radix-ui/react-avatar';
import { v4 as uuidv4 } from 'uuid';
import { ChangeEvent, useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { Input } from '@/components/ui/input';
import Loader from '@/components/shared/Loader';
const CDNURL =
  'https://ozffekhywobfzhaxhppb.supabase.co/storage/v1/object/public/media/';

const EditAccount = ({ username }: { username: string }) => {
  const [profile, setProfile] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const changeProfilePic = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    try {
      const mediaFile = e?.target?.files?.[0];
      if (mediaFile) {
        const endsWith = mediaFile.type.substring(6);
        const imageUrl = uuidv4() + '.' + endsWith.toLowerCase();
        const { error } = await supabase.storage
          .from('media')
          .upload(imageUrl, mediaFile);
        if (error) throw error;
        const { error: picError } = await supabase
          .from('users')
          .update({ profileImg: CDNURL + imageUrl })
          .eq('username', username);
        if (picError) throw picError;
        setProfile(CDNURL + imageUrl);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const changeProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfilePc(username);
        if (data) setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    changeProfile();
  }, [username, profile]);
  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    try {
      await updateBio(username, bio);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    window.location.reload();
  };
  useEffect(() => {
    const getUserBio = async () => {
      setLoading(true);
      try {
        const data = await getBio(username);
        if (data) setBio(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getUserBio();
  }, [username]);
  if (loading)
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    );
  return (
    <form
      className=' pl-5 md:pl-10 pt-16 md:pt-10 flex flex-col h-full pb-32 mx-auto w-full'
      onSubmit={handleSubmit}
    >
      <span className='fixed top-0 right-0 left-0 text-center h-fit py-2 border-b border-zinc-200 flex items-center justify-center z-20 bg-white font-semibold md:opacity-0 md:absolute md:left-[10000px]'>
        Edit profile
      </span>
      <span className='text-xl font-bold mb-6 md:mb-10'>Edit profile</span>
      <div className='bg-zinc-100 w-[95%] md:w-[60%] h-[20%] md:h-[15%] flex items-center justify-between md:px-5 rounded-2xl mb-10 py-2 px-2'>
        <div className='flex items-center justify-start gap-2 md:gap-4'>
          <button className='w-10 md:w-14 cursor-pointer rounded-full relative'>
            <Avatar>
              <div className='rounded-full overflow-hidden w-10 h-10 md:h-14 md:w-14 flex items-center justify-center cursor-pointer'>
                <img
                  className='object-cover w-full h-full'
                  src={profile}
                  alt='Profile'
                />
              </div>
            </Avatar>
            <Input
              onChange={changeProfilePic}
              type='file'
              className='absolute top-0 right-0 left-0 opacity-0 overflow-hidden h-full object-cover rounded-full cursor-pointer'
            />
          </button>
          <span className='text-base font-bold'>{username}</span>
        </div>
        <button className='relative py-1 px-2 md:py-2 md:px-4 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-md cursor-pointer'>
          Change photo
          <Input
            type='file'
            className='left-0 right-0 h-full top-0 overflow-hidden object-cover opacity-0 absolute cursor-pointer'
            onChange={changeProfilePic}
          />
        </button>
      </div>
      <span className='text-xl font-bold mb-6'>Bio</span>
      <div className='w-full h-full mb-6 md:mb-10'>
        <input
          maxLength={100}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          type='text'
          placeholder='Bio'
          className='md:max-w-[60%] w-[95%] md:w-[60%] h-[50%] md:h-2/5 rounded-xl border border-zinc-300 pl-4 bio relative pb-5 text-wrap'
        />
      </div>
      <button
        className='py-3 px-4 mx-auto md:ml-[374px] w-1/3 md:w-1/4 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-md cursor-pointer'
        type='submit'
      >
        Submit
      </button>
    </form>
  );
};
export default EditAccount;
