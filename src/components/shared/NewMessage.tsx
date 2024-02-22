import { getUsers } from '@/config/api';
import { Avatar } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewMessage = ({
  setOpen,
  email,
}: {
  setOpen: (arg0: boolean) => void;
  email: string | undefined;
}) => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const [users, setUsers] = useState<
    { username: string; profileImg: string }[]
  >([]);
  useEffect(() => {
    const getConv = async () => {
      if (email) {
        try {
          const data = await getUsers(email);
          if (data) setUsers(data.filter((user) => user.username === value));
        } catch (error) {
          console.error(error);
        }
      }
    };
    getConv();
  }, [email, value]);
  return (
    <div
      className='w-[100%] h-[100%] fixed bg-[rgba(0,0,0,0.65)]'
      onClick={() => {
        setOpen(false);
      }}
    >
      <div
        className='fixed md:top-[50%] md:left-[50%] md:translate-x-[-50%] md:translate-y-[-50%] bg-white rounded-[10px] flex flex-col items-between md:w-[555px] md:h-[420px] w-full h-full z-60'
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className='flex items-center justify-between mt-3.5 mb-3.5'>
          <span className='mx-auto font-bold text-base'>New message</span>
          <span
            className='mr-6 font-semibold text-xl cursor-pointer'
            onClick={() => {
              setOpen(false);
            }}
          >
            X
          </span>
        </div>
        <div className='flex items-center justify-between w-full border-y border-neutral-200 py-1.5 pl-3'>
          <span className='font-semibold text-base mr-1'>To:</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type='text'
            placeholder='Search...'
            className='w-[90%] mx-auto text-sm text-black focus:outline-none'
          />
        </div>
        {!users ? (
          <span className='text-sm opacity-60 overflow-y-scroll fixed bottom-20 top-[120px] right-0 left-7'>
            No account found.
          </span>
        ) : (
          <div className='absolute bottom-20 top-[100px] left-0 w-full pt-3'>
            {users.map((user) => {
              return (
                <div
                  key={user.username}
                  className='cursor-pointer hover:bg-zinc-100 active:bg-zinc-100 flex items-center justify-start py-2 pl-3'
                  onClick={() => {
                    setOpen(false);
                    navigate(`/messages/${user.username}`);
                  }}
                >
                  <button className='w-11 mr-2 cursor-pointer rounded-full'>
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
                  <span>{user.username}</span>
                </div>
              );
            })}
          </div>
        )}
        <button
          disabled
          className='bg-[#0095F5] hover:bg-[#1877F6] focus:bg-[#1877F6] active:bg-[#1877F6] transition py-3 rounded-lg font-semibold text-sm text-center text-white opacity-20 fixed bottom-3 left-5 right-5'
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default NewMessage;
