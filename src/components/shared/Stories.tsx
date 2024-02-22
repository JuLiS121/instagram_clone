import { getFollowing, getUsers } from '@/config/api';
import { Avatar } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const Stories = ({
  username,
  email,
}: {
  username: string;
  email: string | undefined;
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState<
    { username: string; profileImg: string }[]
  >([]);
  useEffect(() => {
    const getFollowersInfo = async () => {
      setLoading(true);
      if (email) {
        try {
          const followingData = await getFollowing(username);
          const follow = followingData?.map((follow) => follow.followed);
          const users = await getUsers(email);
          const followers = users?.filter((user) =>
            follow?.includes(user.username)
          );
          if (followers) setFollowing(followers);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    getFollowersInfo();
  }, [username, email]);
  if (loading) return <Loader />;
  return (
    <div className='mt-6 flex flex-col w-full md:w-[85%] mx-auto'>
      <span className='pt-5 pl-4 lg:pl-0 text-lg md:text-base font-bold mb-1 fixed md:static border-b border-zinc-200 bg-white top-0 right-0 left-0 h-16'>
        Following
      </span>
      <div className='mb-11 mt-16 md:mt-6 lg:mt-3 flex items-center justify-start gap-2 pl-4 md:pl-0'>
        {following &&
          following.map((follow) => {
            return (
              <div
                key={follow.username}
                className='flex flex-col items-center justify-center mr-1 h-16 w-16'
              >
                <button
                  className='rounded-full cursor-pointer'
                  onClick={() => navigate(`/${follow.username}`)}
                >
                  <Avatar>
                    <div className='rounded-full overflow-hidden h-14 w-14 flex items-center justify-center'>
                      <img
                        className='object-cover w-full h-full'
                        src={follow.profileImg}
                        alt='Profile'
                      />
                    </div>
                  </Avatar>
                </button>
                <span
                  className='mt-1 mx-auto text-xs cursor-pointer'
                  onClick={() => navigate(`/${follow.username}`)}
                >
                  {follow.username}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Stories;
