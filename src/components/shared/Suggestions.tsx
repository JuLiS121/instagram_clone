import { follow, getFollowing, getUserProfilePc, getUsers } from '@/config/api';
import { Avatar } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Suggestions = ({
  setOpenLogin,
  username,
  email,
}: {
  setOpenLogin: (arg0: boolean) => void;
  username: string;
  email: string | undefined;
}) => {
  const [users, setUsers] = useState<
    { username: string; profileImg: string }[] | undefined
  >([]);
  const [profile, setProfile] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      if (email) {
        try {
          const data = await getUsers(email);
          const followingData = await getFollowing(username);
          const followersData = data?.filter((user) => {
            return !followingData?.some(
              (followedUser) => followedUser.followed === user.username
            );
          });
          setUsers(followersData?.slice(0, 5));
          const profilePic = await getUserProfilePc(username);
          setProfile(profilePic);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [email, username, users]);

  return (
    <div className='mt-[60px] w-[85%] pl-8'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex items-center gap-1'>
          <button
            className='mr-1 rounded-full cursor-pointer'
            onClick={() => navigate(`/${username}`)}
          >
            <Avatar>
              <div className='rounded-full overflow-hidden h-11 w-11 flex items-center justify-center'>
                <img
                  className='object-cover w-full h-full'
                  src={profile}
                  alt='Profile'
                />
              </div>
            </Avatar>
          </button>
          <span
            className='cursor-pointer active:opacity-60'
            onClick={() => navigate(`/${username}`)}
          >
            {username}
          </span>
        </div>
        <span
          className='text-cyan-500 text-xs font-semibold cursor-pointer'
          onClick={() => setOpenLogin(true)}
        >
          Switch
        </span>
      </div>
      <div className='flex w-full justify-between items-center mb-4'>
        <span className='text-[#737373] font-semibold text-sm'>
          Suggested for you
        </span>
        <span className='font-semibold text-xs'>See All</span>
      </div>

      {users?.map((user) => {
        return (
          <div
            key={user.username}
            className='flex justify-between items-center mb-5'
          >
            <div className='flex items-center gap-1'>
              <button
                className='mr-1 rounded-full cursor-pointer'
                onClick={() => navigate(`/${user.username}`)}
              >
                <Avatar>
                  <div className='rounded-full overflow-hidden h-11 w-11 flex items-center justify-center'>
                    <img
                      className='object-cover w-full h-full'
                      src={user.profileImg}
                      alt='Profile'
                    />
                  </div>
                </Avatar>
              </button>
              <div className='flex flex-col justify-center items-start'>
                <span
                  className='text-sm cursor-pointer active:opacity-60'
                  onClick={() => navigate(`/${user.username}`)}
                >
                  {user.username}
                </span>
                <span className='text-[#737373] font-normal text-xs'>
                  Suggested for you
                </span>
              </div>
            </div>
            <span
              className='text-cyan-500 text-xs font-semibold cursor-pointer'
              onClick={() => {
                follow(username, user.username);
                window.location.reload();
              }}
            >
              Follow
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Suggestions;
