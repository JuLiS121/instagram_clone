import {
  addMessage,
  getConversation,
  getMyMessages,
  getUserProfilePc,
} from '@/config/api';
import { supabase } from '@/config/supabase';
import { Avatar } from '@radix-ui/react-avatar';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Text = ({
  username,
  setOpen,
  setOpenLogin,
}: {
  setOpenLogin: (arg0: boolean) => void;
  setOpen: (arg0: boolean) => void;
  username: string;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState('');
  const [receiver, setReceiver] = useState('');
  const [value, setValue] = useState('');
  const [senders, setSenders] = useState<
    { username: string; profileImg: string }[]
  >([]);
  const [avMessages, setAvMessages] = useState<
    {
      created_at: string;
      message_id: string;
      sender: string;
      receiver: string;
      message_text: string;
    }[]
  >([]);
  const [messages, setMessages] = useState<
    {
      message_text: string;
      sender: string;
      receiver: string;
      created_at: string;
      message_id: string;
    }[]
  >([]);
  const prevAvMessagesRef = useRef<
    {
      message_text: string;
      sender: string;
      receiver: string;
      created_at: string;
      message_id: string;
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
        if (
          data &&
          JSON.stringify(prevAvMessagesRef.current) !==
            JSON.stringify(avMessages)
        ) {
          setAvMessages(() => {
            // Ensure conversations are filtered correctly
            return conversations.filter((conv) => conv !== username);
          });
        }

        // Update prevAvMessagesRef with the current avMessages
        prevAvMessagesRef.current = avMessages;

        const senders = [];
        for (const i of avMessages) {
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
    };
    getMessage();
  }, [username, avMessages, setSenders]); // Removed setAvMessages from dependency array

  useEffect(() => {
    const getReceiver = () => {
      setReceiver(location.pathname.substring(10).split('/').toString());
    };
    getReceiver();
  }, [location.pathname]);
  useEffect(() => {
    const getProfile = async () => {
      try {
        const profilePic = await getUserProfilePc(receiver);
        setProfile(profilePic);
      } catch (error) {
        console.error(error);
      }
    };
    getProfile();
  }, [receiver]);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const data = await getConversation(username, receiver);
        if (data) setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };
    getMessages();
  }, [username, receiver, value, messages.length, avMessages.length]);
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await addMessage(username, receiver, value);
      const data = await getConversation(username, receiver);
      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error(error);
    }
    setValue('');
  };

  return (
    <div className='w-full'>
      <div className='max-[768px]:absolute max-[768px]:opacity-0 max-[768px]:right-[10000px] md:w-[29.5%] fixed top-0 bottom-0 md:left-[66px] flex flex-col bg-white border-x-2 border-gray-100 rounded-2xl bg-white'>
        <div className='flex items-center justify-between mt-10 ml-7 mb-5 w-full'>
          <div
            className='flex items-center gap-1'
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
            className='w-14 pr-9 cursor-pointer'
            onClick={() => setOpen(true)}
          />
        </div>
        <div className='flex items-center justify-between w-full'>
          <span className='ml-7 font-bold text-base'>Messages</span>
          <span className='text-[#737373] font-semibold text-sm mr-7'>
            Requests
          </span>
        </div>
        <div className='md:absolute top-32 left-0 right-0 bottom-0 overflow-y-auto'>
          {senders &&
            senders.map((sender) => {
              return (
                <div
                  key={sender.username}
                  className={`flex items-center justify-start pl-8 cursor-pointer ${
                    sender.username ===
                    location.pathname.substring(10).split('/').toString()
                      ? 'bg-zinc-100'
                      : 'hover:bg-slate-50'
                  } py-2`}
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
      <div className='fixed top-0 h-full bottom-0 right-0 left-0 md:left-[469px] flex flex-col justify-center items-center gap-1'>
        <div className='fixed top-0 right-0 left-0 md:left-[469px] max-[768px]:py-1 h-fit md:h-[12%] border-b border-zinc-200 flex items-center justify-between pb-2'>
          <div onClick={() => navigate('/messages')}>
            <img
              src='/insta-pics/left-arrow.png'
              alt='back'
              className='w-11 pl-1.5 md:opacity-0 md:absolute md:right-[10000px]'
            />
          </div>
          <div className='flex-start md:mr-auto md:pl-4 flex items-center gap-2'>
            <button
              className='w-8 md:w-11 md:mr-1 cursor-pointer rounded-full'
              onClick={() => navigate(`/${receiver}`)}
            >
              <Avatar>
                <div className='rounded-full overflow-hidden w-8 h-8 md:h-11 md:w-11 flex items-center justify-center'>
                  <img
                    className='object-cover w-full h-full'
                    src={profile}
                    alt='Profile'
                  />
                </div>
              </Avatar>
            </button>
            <span
              className='text-base font-semibold cursor-pointer'
              onClick={() => navigate(`/${receiver}`)}
            >
              {receiver}
            </span>
          </div>
          <div className='flex-end flex items-center gap-2 md:gap-3 pr-1.5 md:pr-7'>
            <img
              className='w-7 cursor-pointer'
              src='/insta-pics/phone.png'
              alt=''
            />
            <img
              className='w-7 cursor-pointer'
              src='/insta-pics/video-call.png'
              alt=''
            />
            <img
              className='w-7 cursor-pointer'
              src='/insta-pics/circle-with-i.png'
              alt=''
            />
          </div>
        </div>
        <div className='w-full bottom-[13%] max-h-[75%] overflow-y-auto flex flex-col gap-1'>
          <div className='flex flex-col items-center justify-center md:mt-10 mb-24'>
            <button className='w-24 cursor-pointer rounded-full mb-3'>
              <Avatar>
                <div className='rounded-full overflow-hidden h-24 w-24 flex items-center justify-center'>
                  <img
                    className='object-cover w-full h-full'
                    src={profile}
                    alt='Profile'
                  />
                </div>
              </Avatar>
            </button>
            <span className='font-semibold text-lg'>{receiver}</span>
            <span className='text-sm opacity-70 mb-5'>Instagram</span>
            <button
              className='font-semibold text-sm py-1.5 md:px-3 bg-stone-200 cursor-pointer rounded-lg hover:bg-stone-300'
              onClick={() => navigate(`/${receiver}`)}
            >
              View profile
            </button>
          </div>
          {messages &&
            messages.map((message) => {
              return (
                <div
                  key={message.message_id}
                  className={`h-auto flex items-center flex-wrap message-container ${
                    message.sender === username
                      ? 'justify-end pr-2 md:pr-8'
                      : 'justify-start pl-2 md:pl-3'
                  }`}
                >
                  {username !== message.sender && (
                    <button className='w-7 md:mr-2 cursor-pointer rounded-full'>
                      <Avatar>
                        <div className='rounded-full overflow-hidden h-7 w-7 flex items-center justify-center'>
                          <img
                            className='object-cover w-full h-full'
                            src={profile}
                            alt='Profile'
                          />
                        </div>
                      </Avatar>
                    </button>
                  )}
                  <span
                    className={`rounded-xl px-2 py-px w-fit max-w-[70%] h-fit text-wrap ${
                      message.sender === username
                        ? 'text-white bg-sky-500'
                        : 'text-black bg-zinc-200'
                    }`}
                  >
                    {message.message_text}
                  </span>
                </div>
              );
            })}
        </div>
        <div className='fixed bottom-10 lg:bottom-0 right-0 left-0 md:left-[469px] h-[13%] flex items-center justify-center'>
          <form className='w-[95%] h-[55%] md:relative' onSubmit={handleSubmit}>
            <span
              className='absolute max-[768px]:opacity-0 max-[768px]:right-[10000px] top-[9px] left-3 text-xl cursor-pointer'
              onClick={() => setValue(value + '🙂')}
            >
              🙂
            </span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type='text'
              className='lg:absolute w-full h-full rounded-3xl border border-zinc-200 pl-3 pr-11 md:pl-11 md:pr-20 focus:outline-none overflow-y-auto whitespace-wrap'
              placeholder='Message...'
            />
            <div className='flex absolute items-center gap-1 md:gap-4 bottom-0 right-0 md:pr-8 pr-5 top-0 md:pl-2'>
              {!value ? (
                <>
                  <img
                    className='w-6 cursor-pointer max-[768px]:opacity-0 max-[768px]:absolute max-[768px]:right-[10000px]'
                    src='/insta-pics/voice-icon.jpg'
                    alt=''
                  />
                  <img
                    className='w-6 cursor-pointer'
                    src='/insta-pics/gallery2.png'
                    alt=''
                  />
                  <img
                    className='w-7 cursor-pointer max-[768px]:opacity-0 max-[768px]:absolute max-[768px]:right-[10000px]'
                    src='/insta-pics/notifications.png'
                    alt=''
                  />
                </>
              ) : (
                <button className='text-sm text-cyan-500 cursor-pointer md:pl-5'>
                  Send
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Text;
