import { getMyMessages } from '@/config/api';
import { supabase } from '@/config/supabase';
import { Avatar } from '@radix-ui/react-avatar';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
const Messages = ({
  username,
  setOpen,
  setOpenLogin,
}: {
  setOpenLogin: (arg0: boolean) => void;
  setOpen: (arg0: boolean) => void;
  username: string;
}) => {
  const navigate = useNavigate();
  const [senders, setSenders] = useState<
    { profileImg: string; username: string }[]
  >([]);
  const [messages, setMessages] = useState<
    {
      created_at: string;
      message_id: string;
      sender: string;
      receiver: string;
      message_text: string;
    }[]
  >([]);
  useEffect(() => {
    const getMessage = async () => {
      try {
        const data = await getMyMessages(username);
        const conversations = [
          ...new Set(
            data?.map((message) => {
              return message.receiver;
            })
          ),
        ];
        if (data)
          setMessages(conversations.filter((conv) => conv !== username));
      } catch (error) {
        console.error(error);
      }
    };
    getMessage();
  }, [username]);

  const fetchSenders = useCallback(async () => {
    try {
      const senders = [];
      for (const i of messages) {
        const { data, error } = await supabase
          .from('users')
          .select('username,profileImg')
          .eq('username', i)
          .single();
        if (error) throw error;
        senders.push(data);
      }
      setSenders(senders);
    } catch (error) {
      console.error(error);
    }
  }, [messages]);

  useEffect(() => {
    fetchSenders();
  }, [fetchSenders]);

  return (
    <div>
      <div className='max-[768px]:right-0 left-0 md:w-[29.5%] fixed top-0 bottom-0 md:left-[58px] lg:left-[66px] flex flex-col border-x-2 border-gray-100 rounded-2xl bg-white'>
        <div className='flex items-center justify-between max-[768px]:fixed max-[768px]:top-0 max-[768px]:left-0 max-[768px]:right-0 max-[768px]:h-fit max-[768px]:mx-auto py-2 max-[768px]:bg-white z-20 md:mt-6 md:ml-7 md:mb-5 w-full'>
          <div onClick={() => navigate('/')}>
            <img
              src='/insta-pics/left-arrow.png'
              alt='back'
              className='w-9 pl-2 md:opacity-0 md:absolute md:left-[10000px]'
            />
          </div>
          <div
            className='flex items-center gap-1 md:mr-auto max-[768px]:mx-auto'
            onClick={() => setOpenLogin(true)}
          >
            <span className='font-bold text-xl cursor-pointer'>{username}</span>
            <img
              src='/insta-pics/down-arrow.png'
              alt='change'
              className='w-[14px] h-4 pt-1 cursor-pointer'
            />
          </div>
          <img
            src='/insta-pics/write-message.jpg'
            alt='New Message'
            className='w-7 pr-2 md:pr-9 md:w-14 mr-7 cursor-pointer'
            onClick={() => setOpen(true)}
          />
        </div>
        <div className='flex items-center justify-between max-[768px]:px-3 w-full max-[768px]:mt-10'>
          <span className='md:ml-7 font-bold text-base'>Messages</span>
          <span className='text-[#737373] font-semibold text-sm md:mr-7'>
            Requests
          </span>
        </div>
        <div className='absolute top-20 md:top-32 left-0 right-0 bottom-0 overflow-y-auto'>
          {senders &&
            senders.map((sender) => {
              return (
                <div
                  key={sender.username}
                  className='flex items-center justify-start pl-3 md:pl-7 cursor-pointer hover:bg-slate-100 py-2'
                  onClick={() => navigate(`/messages/${sender.username}`)}
                >
                  <button className='w-14 mr-2 cursor-pointer rounded-full'>
                    <Avatar>
                      <div className='rounded-full overflow-hidden h-14 w-14 flex items-center justify-center'>
                        <img
                          className='object-cover w-full h-full'
                          src={sender.profileImg}
                          alt='Profile'
                        />
                      </div>
                    </Avatar>
                  </button>
                  <span>{sender.username}</span>
                </div>
              );
            })}
        </div>
      </div>
      <div className='absolute opacity-0 md:opacity-100 md:fixed md:top-0 md:bottom-0 md:right-0 md:left-[469px] flex flex-col justify-center items-center gap-1 '>
        <div className='rounded-full border-4 border-black mb-3'>
          <img
            src='/insta-pics/messages.png'
            alt='Messages'
            className='w-24 p-5'
          />
        </div>
        <span className='text-xl font-normal tracking-wide'>Your messages</span>
        <span className='text-[#505050]font-semibold mb-3.5 text-sm opacity-70'>
          Send private photos and messages to a friend or group
        </span>
        <button
          className='bg-[#0095F5] hover:bg-[#1877F6] focus:bg-[#1877F6] active:bg-[#1877F6] transition py-1.5 px-4 rounded-lg font-semibold text-sm text-center text-white'
          onClick={() => {
            setOpen(true);
          }}
        >
          Send message
        </button>
      </div>
    </div>
  );
};

export default Messages;
