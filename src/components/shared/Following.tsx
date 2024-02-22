import { useEffect, useState } from 'react';
import { supabase } from './../../config/supabase';
import { Avatar } from '@radix-ui/react-avatar';
import { unFollow } from '@/config/api';
import { useLocation } from 'react-router-dom';

const Following = ({
  setOpen,
  username,
  followingNumber,
  setFollowingNumber,
}: {
  followingNumber: number;
  setFollowingNumber: (arg0: number) => void;
  setOpen: (arg0: boolean) => void;
  username: string;
}) => {
  const location = useLocation();
  const [value, setValue] = useState('');
  const [active, setActive] = useState(true);
  const [followed, setFollowed] = useState<
    { FollowInfo: string; followed: string }[]
  >([]);
  const [follow, setFollow] = useState<{ followed: string }[]>([]);
  console.log({ username, followed, follow, loc: location.pathname, value });

  useEffect(() => {
    const getFollowers = async () => {
      if (location.pathname.substring(1).split('/').toString()) {
        try {
          const { data, error } = await supabase
            .from('followers')
            .select('followed')
            .eq(
              'follower',
              location.pathname.substring(1).split('/').toString()
            );
          if (error) throw error;
          if (value && !data.map((follow) => follow.followed).includes(value))
            setFollowed([]);
          if (value && data.map((follow) => follow.followed).includes(value))
            setFollow([{ followed: value }]);
          else {
            setFollow(data);
          }
          const followerInfo: { FollowInfo: string; followed: string }[] =
            await Promise.all(
              data.map(async (follow) => {
                const { data, error } = await supabase
                  .from('users')
                  .select('profileImg,username')
                  .eq('username', follow.followed)
                  .single();
                if (error) throw error;
                const FollowInfo = data.profileImg;
                return { ...follow, FollowInfo };
              })
            );
          setFollowed(followerInfo);
        } catch (error) {
          console.error(error);
        }
      }
    };
    getFollowers();
  }, [username, followed.length, follow.length, location.pathname, value]);

  const handleClick: React.MouseEventHandler<
    HTMLImageElement | HTMLInputElement | HTMLButtonElement
  > = (e) => {
    e.stopPropagation();
    setActive(false);
    const inputElement = e.currentTarget.parentElement?.querySelector('input');
    if (inputElement) {
      inputElement.focus();
    }
  };

  return (
    <div
      className='top-0 right-0 left-0 bottom-0 fixed bg-[rgba(0,0,0,0.65)]'
      onClick={() => {
        setOpen(false);
      }}
    >
      <div
        className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[10px] flex flex-col items-between w-[400px] h-[400px]'
        onClick={(e) => {
          e.stopPropagation();
          setActive(true);
        }}
      >
        <div className='flex flex-col items-center justify-center'>
          <div className='flex items-center justify-between w-full py-2 mb-2 border-b border-gray-200'>
            <span className='mx-auto pl-6 font-semibold text-base'>
              Following
            </span>
            <span
              className='flex-end pr-4 font-bold text-base cursor-pointer'
              onClick={() => setOpen(false)}
            >
              X
            </span>
          </div>
          <div className='w-full border-b-2 border-neutral-200 text-center mb-3'>
            <div className='w-1/2 border-b border-black pb-2 mx-auto'>
              <span className='text-sm font-semibold text-cyan-900'>
                People
              </span>
            </div>
          </div>
          <img
            src='/insta-pics/search.png'
            alt='Search'
            className={`w-4 absolute top-[103px] left-8 hover:cursor-text active:cursor-text ${
              active ? 'opacity-45' : 'opacity-0'
            }`}
            onClick={handleClick}
          />
          <input
            onClick={handleClick}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type='text'
            placeholder='Search'
            className={`w-[90%] mx-auto bg-gray-100 border-none text-sm py-1.5 ${
              active ? 'pl-10' : 'pl-4'
            } rounded-lg text-base mb-7 focus:outline-none`}
          />
          <button
            className={`relative left-[160px] bottom-[50px] rounded-full text-white bg-gray-200 text-xs h-1/2 px-1 ${
              !value && 'opacity-0 cursor-text'
            }`}
            onClick={(e) => {
              !value && handleClick(e);
              setValue('');
            }}
          >
            x
          </button>
        </div>
        <div className='absolute top-[140px]'>
          {!followed ? (
            <>
              <span className='text-base font-semibold ml-6'>Recent</span>
              <span className='mx-auto mt-[206px] font-semibold text-sm text-[#737373]'>
                No followers.
              </span>
            </>
          ) : (
            followed.map((user) => {
              return (
                <div
                  className='mt-2 overflow-y-auto w-full flex items-center justify-between pl-4 cursor-pointer'
                  key={user.followed}
                >
                  <div className='flex items-center justify-start pl-2 mr-36'>
                    <button className='w-10 mr-2 cursor-pointer rounded-full'>
                      <Avatar>
                        <div className='rounded-full overflow-hidden h-10 w-10 flex items-center justify-center'>
                          <img
                            className='object-cover w-full h-full'
                            src={user.FollowInfo}
                            alt='Profile'
                          />
                        </div>
                      </Avatar>
                    </button>
                    <span>{user.followed}</span>
                  </div>
                  {user.followed !== username && (
                    <button
                      className='text-sm bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg font-semibold'
                      onClick={async () => {
                        await unFollow(username, user.followed);
                        const { data, error } = await supabase
                          .from('followers')
                          .select('followed')
                          .eq('follower', username);
                        if (error) throw error;
                        setFollow(data);
                        setFollowingNumber(followingNumber - 1);
                      }}
                    >
                      Following
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Following;
