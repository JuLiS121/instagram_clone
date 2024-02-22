import { Avatar } from '@radix-ui/react-avatar';
import NoPosts from '../../components/shared/NoPosts';
import Image from '../../components/shared/Image';
import { Saved, Tagged } from '.';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { ChangeEvent, useEffect, useState, useRef } from 'react';
import { supabase } from '@/config/supabase';
import {
  follow,
  getBio,
  getFollowers,
  getFollowing,
  getPosts,
  getUserProfilePc,
  unFollow,
} from '@/config/api';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';

export interface ImageObject {
  imageUrl: string;
  post_id: string;
  creator: string;
  caption: string;
  created_at: Date;
}

const CDNURL =
  'https://ozffekhywobfzhaxhppb.supabase.co/storage/v1/object/public/media/';

const Profile = React.memo(
  ({
    setOpenFollowed,
    setOpenCreate,
    username,
    handleOpenComments,
    setOpenFollowers,
    followingNumber,
    setFollowingNumber,
    followedNumber,
    setFollowedNumber,
    changeBtn,
    setOpenLogin,
    setToken,
  }: {
    setOpenLogin: (arg0: boolean) => void;
    setToken: (arg0: string | undefined) => void;
    changeBtn: (arg0: string) => void;
    followingNumber: number;
    setFollowingNumber: (arg0: number) => void;
    followedNumber: number;
    setFollowedNumber: (arg0: number) => void;
    setOpenFollowed: (arg0: boolean) => void;
    setOpenFollowers: (arg0: boolean) => void;
    handleOpenComments: (arg0: ImageObject) => void;
    setOpenCreate: (arg0: boolean) => void;
    username: string;
  }) => {
    const { user } = useParams();
    const [images, setImages] = useState<ImageObject[]>([]);
    const [postsCount, setPostsCount] = useState(0);
    const [follower, setFollower] = useState<
      { follower: string }[] | undefined
    >([]);
    const [followed, setFollowed] = useState<
      { followed: string }[] | undefined
    >([]);
    const [profile, setProfile] = useState('');
    const [text, setText] = useState('Follow');
    const location = useLocation();
    const navigate = useNavigate();
    const [bio, setBio] = useState('');

    const prevFollower = useRef<{ follower: string }[] | undefined>();
    const prevFollowed = useRef<{ followed: string }[] | undefined>();

    useEffect(() => {
      // Store current follower state in the ref
      prevFollower.current = follower;
    }, [follower]);

    useEffect(() => {
      // Store current followed state in the ref
      prevFollowed.current = followed;
    }, [followed]);

    useEffect(() => {
      const getFollower = async () => {
        if (user) {
          try {
            const data = await getFollowers(user);
            if (data) {
              // Compare current follower state with the previous one
              if (data !== prevFollower.current) {
                setFollower(data);
                setFollowedNumber(data.length);
              }
            }
            const isFollowing = data?.some((f) => f.follower === username);
            setText(isFollowing ? 'Unfollow' : 'Follow');
          } catch (error) {
            console.error(error);
          }
        }
      };
      getFollower();
    }, [user, username, followedNumber, setFollowedNumber]);
    useEffect(() => {
      const getFollower = async () => {
        if (user) {
          try {
            const data = await getFollowing(user);
            if (data) {
              // Compare current follower state with the previous one
              if (data !== prevFollowed.current) {
                setFollowed(data);
                setFollowingNumber(data.length);
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      };
      getFollower();
    }, [user, followingNumber, setFollowingNumber]);

    useEffect(() => {
      const getPost = async () => {
        if (user) {
          try {
            const profilePic = await getUserProfilePc(user);
            if (profilePic) setProfile(profilePic);
          } catch (error) {
            console.error(error);
          }
        }
      };
      getPost();
    }, [user]);

    useEffect(() => {
      const fetchData = async () => {
        if (user) {
          try {
            const data = await getPosts(user);
            if (data) setPostsCount(data.length);
          } catch (error) {
            console.log(error);
          }
        }
      };
      fetchData();
    }, [user]);

    useEffect(() => {
      const fetchData = async () => {
        if (user) {
          try {
            const { data, error } = await supabase
              .from('posts')
              .select('imageUrl,creator,post_id,caption,created_at')
              .eq('creator', user);
            if (error) throw error;
            setImages(data);
          } catch (error) {
            console.error(error);
          }
        }
      };
      fetchData();
    }, [user]);
    useEffect(() => {
      const bio = async () => {
        if (user) {
          try {
            const data = await getBio(user);
            if (data) setBio(data);
          } catch (error) {
            console.error(error);
          }
        }
      };
      bio();
    }, [user]);

    const uploadProfilePic = async (e: ChangeEvent<HTMLInputElement>) => {
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
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <div className='w-full md:w-[85%] mx-auto mt-8 text-wrap'>
        <div className='fixed right-0 left-0 top-0 h-fit py-2 bg-white z-20 md:opacity-0 md:absolute md:right-[10000px] border-b border-zinc-200 flex items-center justify-between'>
          <span
            className='font-semibold cursor-pointer pl-2'
            onClick={() => {
              setToken(undefined);
              sessionStorage.removeItem('token');
              navigate('/sign-in');
            }}
          >
            Log out
          </span>
          <span className='font-semibold'>{user}</span>
          <span
            className='font-semibold cursor-pointer pr-2'
            onClick={() => {
              changeBtn('');
              setOpenLogin(true);
            }}
          >
            Switch
          </span>
        </div>
        <div className='max-[768px]:py-4 w-full mb-4 md:mb-10 mt-14 md:mt-0 items-start flex md:gap-x-[60px] pl-4 lg:pl-16 flex-wrap gap-x-6'>
          <button className='md:mr-8 rounded-full h-20 w-20 md:h-36 md:w-36 max-[380px]:mx-auto max-[768px]:mb-2'>
            <Avatar>
              <div className='rounded-full overflow-hidden h-20 w-20 md:h-36 md:w-36 flex items-center justify-center'>
                {user === username && (
                  <Input
                    type='file'
                    className='opacity-0 object-cover w-[120px] h-[120px] cursor-pointer overflow-hidden absolute pb-4'
                    onChange={uploadProfilePic}
                  />
                )}
                <img
                  className='object-cover w-full h-full'
                  src={profile}
                  alt='Profile'
                />
              </div>
            </Avatar>
          </button>
          <div className='flex flex-col items-between gap-2 md:gap-6'>
            <div className='w-fit flex flex-start gap-2 items-center'>
              <span className='md:mr-3'>{user}</span>
              <button
                className='text-[14px] text-center font-semibold bg-stone-200 hover:bg-stone-300 px-3.5 py-1.5 rounded-lg'
                onClick={async () => {
                  if (user === username) navigate('/edit-account');
                  if (user && follower) {
                    const isFollowing = follower.some(
                      (f) => f.follower === username
                    );
                    if (!isFollowing) {
                      await follow(username, user);
                      setFollower([...follower, { follower: username }]);
                      setFollowedNumber(followedNumber + 1);
                      setText('Unfollow');
                    } else {
                      await unFollow(username, user);
                      setFollower(
                        follower.filter((f) => f.follower !== username)
                      );
                      setFollowedNumber(followedNumber - 1);
                      setText('Follow');
                    }
                  }
                }}
              >
                {user === username ? 'Edit profile' : text}
              </button>
              <button
                className='text-[14px] text-center font-semibold bg-stone-200 hover:bg-stone-300 px-3.5 py-1.5 rounded-lg'
                onClick={() => {
                  if (user !== username) {
                    changeBtn('messages');
                    navigate(`/messages/${user}`);
                  }
                }}
              >
                {user === username ? 'View archive' : 'Message'}
              </button>
            </div>
            <div className='flex gap-6 items-center'>
              <span>{postsCount} posts</span>
              <span
                className='cursor-pointer active:opacity-55'
                onClick={() => setOpenFollowed(true)}
              >
                {follower?.length} followers
              </span>
              <span
                className='cursor-pointer active:opacity-55'
                onClick={() => setOpenFollowers(true)}
              >
                {followed?.length} following
              </span>
            </div>
            <span className='max-w-[300px] text-sm text-wrap'>{bio}</span>
          </div>
        </div>
        <span>
          <hr />
        </span>
        <div className='flex items-center justify-center gap-5 md:gap-[80px]'>
          <span
            className={`cursor-pointer ${
              location.pathname === `/${user}` && 'border-t-2 border-black'
            } pt-5 text-xs font-semibold tracking-[0.15em] flex items-center justify-center gap-2`}
            onClick={() => {
              navigate(`/${user}`);
            }}
          >
            <img src='/insta-pics/9-squares.png' alt='posts' className='w-3' />
            POSTS
          </span>
          {user === username && (
            <span
              className={`cursor-pointer ${
                location.pathname === `/${user}/saved` &&
                'border-t-2 border-black'
              } pt-5 text-xs font-semibold tracking-[0.15em] flex items-center justify-center gap-2`}
              onClick={() => {
                navigate(`/${user}/saved`);
              }}
            >
              <img src='/insta-pics/save.png' alt='posts' className='w-4' />
              SAVED
            </span>
          )}
          <span
            className={`cursor-pointer ${
              location.pathname === `/${user}/tagged` &&
              'border-t-2 border-black'
            } pt-5 text-xs font-semibold tracking-[0.15em] flex items-center justify-center gap-2`}
            onClick={() => {
              navigate(`/${user}/tagged`);
            }}
          >
            <img src='/insta-pics/tagged.png' alt='posts' className='w-4' />
            TAGGED
          </span>
        </div>
        {location.pathname === `/${user}` && !images.length ? (
          <NoPosts
            username={username}
            user={user}
            setOpenCreate={setOpenCreate}
          />
        ) : location.pathname === `/${user}` && images ? (
          <Image handleOpenComments={handleOpenComments} images={images} />
        ) : location.pathname === `/${user}/saved` ? (
          <Saved username={username} handleOpenComments={handleOpenComments} />
        ) : (
          location.pathname === `/${user}/tagged` && <Tagged />
        )}
      </div>
    );
  }
);

export default Profile;
