import { supabase } from '@/config/supabase';
import { Avatar } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = ({ changeBtn }: { changeBtn: (arg0: string) => void }) => {
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
  const handleClick: React.MouseEventHandler<
    HTMLInputElement | HTMLButtonElement | HTMLImageElement
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
      className='w-[29.5%] fixed top-0 bottom-0 left-[66px] bg-white rounded-2xl border-x-2 border-gray-100 flex flex-col'
      onClick={() => setActive(true)}
    >
      <span className='font-semibold text-2xl mt-6 ml-7 mb-5'>Search</span>
      <img
        src='/insta-pics/search.png'
        alt='Search'
        className={`w-4 relative top-[28.4px] left-8 hover:cursor-text active:cursor-text ${
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
        className={`w-[90%] mx-auto bg-[#f5f0ef] border-none py-2 ${
          active ? 'pl-10' : 'pl-4'
        } rounded-lg text-base mb-7 focus:outline-none`}
      />
      <button
        className={`relative bottom-[60px] left-[350px] rounded-full text-white bg-gray-200 w-4 h-5 text-xs pb-1 ${
          !value && 'opacity-0 cursor-text'
        }`}
        onClick={(e) => {
          !value && handleClick(e);
          setValue('');
        }}
      >
        x
      </button>
      <span className='w-full mb-5'>
        <hr />
      </span>
      {!value ? (
        <>
          <span className='text-base font-semibold ml-6'>Recent</span>
          <span className='mx-auto mt-[206px] font-semibold text-sm text-[#737373]'>
            No recent searches.
          </span>
        </>
      ) : (
        users.map((user) => {
          return (
            <div
              className='mt-2 h-[10%] overflow-y-auto w-full flex items-center justify-start pl-4 cursor-pointer hover:bg-gray-100'
              key={user.username}
              onClick={() => {
                changeBtn('');
                navigate(`/${user.username}`);
              }}
            >
              <button className='w-12 mr-2 cursor-pointer rounded-full'>
                <Avatar>
                  <div className='rounded-full overflow-hidden h-12 w-12 flex items-center justify-center'>
                    <img
                      className='object-cover w-full h-full'
                      src={user.profileImg}
                      alt='Profile'
                    />
                  </div>
                </Avatar>
              </button>
              <span>{user.username}</span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Search;
