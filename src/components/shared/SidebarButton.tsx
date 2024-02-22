import { Avatar } from '@radix-ui/react-avatar';
import { Button } from '../ui/button';
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserProfilePc } from '@/config/api';
import Loader from './Loader';

const SidebarButton = ({
  morePostOptions,
  openMessages,
  openOptions,
  nonActiveImg,
  text,
  type,
  changeBtn,
  active,
  activeImg,
  handleCloseCreate,
  username,
}: {
  username: string | null;
  morePostOptions: boolean;
  openMessages: boolean;
  openOptions: boolean;
  nonActiveImg: string;
  text: string;
  activeImg: string;
  type: string;
  changeBtn: (arg0: string) => void;
  active: boolean;
  handleCloseCreate: () => void;
}) => {
  const location = useLocation();
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      if (username) {
        try {
          const data = await getUserProfilePc(username);
          if (data) setProfile(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    getProfile();
  }, [username]);
  const bottomBarText = 'absolute opacity-0 xl:static xl:opacity-100';
  const bottomBar = 'absolute opacity-0 md:static md:opacity-100';

  const isActive =
    active ||
    (text === ''
      ? location.pathname === '/'
      : location.pathname.substring(1) === text);
  if (loading) return <Loader />;
  return (
    <>
      {type === 'page' && (openOptions || morePostOptions || openMessages) ? (
        <Button
          disabled
          onClick={() => {
            changeBtn(text);
          }}
          className={`w-full h-[49px] flex justify-start ${
            openOptions || morePostOptions || openMessages
              ? 'bg-[rgba(0,0,0,0.0)] hover:bg-[rgba(0,0,0,0)]'
              : 'bg-white hover:bg-zinc-100 hover:rounded-[9px] cursor-pointer'
          } text-normal text-base font-[450] gap-4 transition`}
        >
          {text === 'profile' && isActive ? (
            <div
              className={`rounded-full border-2 border-black ${
                !openOptions &&
                !openMessages &&
                !morePostOptions &&
                'hover:w-[28px]'
              }`}
            >
              <Avatar>
                <div className='rounded-full overflow-hidden h-6 w-6 flex items-center justify-center'>
                  <img
                    className='object-cover w-full h-full'
                    src={profile}
                    alt='Profile'
                  />
                </div>
              </Avatar>
            </div>
          ) : text === 'profile' && !isActive ? (
            <div
              className={`rounded-full ${
                !openOptions &&
                !openMessages &&
                !morePostOptions &&
                'hover:w-[28px]'
              }`}
            >
              <Avatar>
                <div className='rounded-full overflow-hidden h-6 w-6 flex items-center justify-center'>
                  <img
                    className='object-cover w-full h-full'
                    src={profile}
                    alt='Profile'
                  />
                </div>
              </Avatar>
            </div>
          ) : (
            text !== 'profile' && (
              <img
                src={isActive ? activeImg : nonActiveImg}
                className={`w-[26px] ${
                  !openOptions &&
                  !openMessages &&
                  !morePostOptions &&
                  'hover:w-[28px]'
                }`}
                alt={text}
              />
            )
          )}
          <p
            className={`${bottomBarText} 
            capitalize ${active && 'font-bold'}`}
          >
            {text === '' ? 'home' : text}
          </p>
        </Button>
      ) : type === 'page' &&
        !openOptions &&
        !morePostOptions &&
        !openMessages ? (
        <NavLink
          to={text === '' ? '/' : text === 'profile' ? '/' + username : text}
          className={`md:py-1 w-full h-full ${
            !openOptions &&
            !morePostOptions &&
            !openMessages &&
            'cursor-pointer'
          }`}
        >
          <Button
            onClick={() => changeBtn(text)}
            className={`w-full h-[49px] flex justify-center xl:justify-start ${
              openOptions || openMessages || morePostOptions
                ? 'bg-[rgba(0,0,0,0)] hover:bg-[rgba(0,0,0,0)]'
                : 'bg-white hover:bg-zinc-100 hover:rounded-[9px] cursor-pointer'
            } text-normal text-base font-[450] md:gap-4 transition  `}
          >
            {text === 'profile' && isActive ? (
              <div
                className={`rounded-full border-2 border-black ${
                  !openOptions &&
                  !openMessages &&
                  !morePostOptions &&
                  'hover:w-[28px]'
                }`}
              >
                <Avatar>
                  <div className='rounded-full overflow-hidden h-6 w-6 flex items-center justify-center'>
                    <img
                      className='object-cover w-full h-full'
                      src={profile}
                      alt='Profile'
                    />
                  </div>
                </Avatar>
              </div>
            ) : text === 'profile' && !isActive ? (
              <div className='rounded-full'>
                <Avatar>
                  <div className='rounded-full overflow-hidden h-6 w-6 flex items-center justify-center hover:w-[28px] hover:h-[28px]'>
                    <img
                      className='object-cover w-full h-full'
                      src={profile}
                      alt='Profile'
                    />
                  </div>
                </Avatar>
              </div>
            ) : (
              <img
                src={isActive ? activeImg : nonActiveImg}
                className={`w-[26px] ${
                  !openOptions &&
                  !openMessages &&
                  !morePostOptions &&
                  'hover:w-[28px]'
                }`}
                alt={text}
              />
            )}
            <p
              className={`${bottomBarText} capitalize ${active && 'font-bold'}`}
            >
              {text === '' ? 'home' : text}
            </p>
          </Button>
        </NavLink>
      ) : (
        <Button
          disabled={openOptions || openMessages || morePostOptions}
          onClick={() => {
            {
              !isActive ? changeBtn(text) : handleCloseCreate();
            }
          }}
          className={`w-full h-[49px] flex justify-center xl:justify-start  ${
            (text === 'more' ||
              text === 'search' ||
              text === 'notifications') &&
            `${bottomBar} w-0 md:w-full  left-[10000px]`
          } ${
            openOptions || openMessages || morePostOptions
              ? 'bg-[0,0,0,0] hover:bg-[0,0,0,0]'
              : 'bg-white hover:bg-zinc-100 hover:rounded-[9px]'
          }  text-normal text-base font-[450]  gap-4 transition  + ${
            text === 'more' ? 'mt-[18px]' : ''
          }`}
        >
          <img
            src={isActive ? activeImg : nonActiveImg}
            className={`${text === 'more' ? 'w-[24px]' : 'w-[26px]'} ${
              text === 'more' ||
              text === 'search' ||
              (text === 'notifications' && bottomBar)
            } ${
              !openOptions &&
              !openMessages &&
              !morePostOptions &&
              text !== 'more'
                ? 'hover:w-[28px]'
                : 'hover:w-[26px]'
            }`}
            alt={text}
          />
          <p
            className={`${bottomBarText} capitalize ${
              active && text === 'more' && 'font-bold'
            }`}
          >
            {text}
          </p>
        </Button>
      )}
    </>
  );
};

export default SidebarButton;
