import { supabase } from '@/config/supabase';
import { Avatar } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExploreSearch = ({
  changeBtn,
}: {
  changeBtn: (arg0: string) => void;
}) => {
  const [active, setActive] = useState(true);
  const [users, setUsers] = useState<
    { username: string; profileImg: string }[]
  >([]);
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('username,profileImg')
          .eq('username', value);
        if (error) throw error;
        if (data) setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    getUsers();
  }, [value]);
  const handleClick: React.MouseEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation();
    setActive(false);
    const inputElement = e.currentTarget.parentElement?.querySelector('input');
    if (inputElement) {
      inputElement.focus();
    }
  };
  return (
    <div
      className='w-full h-full md:opacity-0 md:absolute md:right-[10000px]'
      onClick={() => setActive(true)}
    >
      <input
        onClick={handleClick}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type='text'
        placeholder='Search'
        className={`bg-[#f5f0ef] fixed top-5 right-0 left-0 border-none py-2 ${
          active ? 'pl-10' : 'pl-4'
        } rounded-lg text-base mb-7 focus:outline-none`}
      />
      {value &&
        users.map((user) => {
          return (
            <div
              className='fixed z-20 bg-white left-20 top-20 w-1/2 bottom-20 overflow-y-auto flex items-start justify-start pl-4 cursor-pointer hover:bg-gray-100 rounded-xl'
              key={user.username}
              onClick={() => {
                changeBtn('');
                navigate(`/${user.username}`);
              }}
            >
              <button className='w-10 mr-2 mt-2 cursor-pointer rounded-full'>
                <Avatar>
                  <div className='rounded-full overflow-hidden h-10 w-10 flex items-center justify-center'>
                    <img
                      className='object-cover w-full h-full'
                      src={user.profileImg}
                      alt='Profile'
                    />
                  </div>
                </Avatar>
              </button>
              <span className='mt-4'>{user.username}</span>
            </div>
          );
        })}
    </div>
  );
};

export default ExploreSearch;
