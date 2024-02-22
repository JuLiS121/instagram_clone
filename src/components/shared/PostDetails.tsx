// import { getUserAuth } from '@/config/api';
import { supabase } from '@/config/supabase';
import { useEffect, useRef, useState } from 'react';

import { Avatar } from '@radix-ui/react-avatar';
import { useNavigate } from 'react-router-dom';
import {
  addLike,
  addSave,
  deleteLike,
  deleteSave,
  getFollowing,
} from '@/config/api';
import Loader from './Loader';

export interface ImageObject {
  imageUrl: string;
  creator: string;
  caption: string;
  post_id: string;
  created_at: Date;
}

export interface Post {
  created_at: Date;
  post_id: string;
  creator: string;
  imageUrl: string;
  caption: string;
  profileImage: string;
}

export interface TimeDifference {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const PostDetails = ({
  onOpenComments,
  setOpen,
  username,
  likesCount,
  setLikesCount,
  likedPosts,
  setLikedPosts,
  savedPosts,
  setSavedPosts,
}: {
  likesCount: { [postId: string]: number };
  setLikesCount: (arg0: { [postId: string]: number }) => void;
  likedPosts: string[];
  setLikedPosts: (arg0: string[]) => void;
  savedPosts: string[];
  setSavedPosts: (arg0: string[]) => void;
  openComments: boolean;
  onOpenComments: (arg0: ImageObject) => void;
  setOpen: (arg0: boolean) => void;
  username: string;
}) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [following, setFollowing] = useState<string[] | undefined>([]);
  const [loading, setLoading] = useState(false);

  const followingRef = useRef<string[] | undefined>();
  followingRef.current = following;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data: postsData, error } = await supabase
          .from('posts')
          .select('creator,post_id,imageUrl,caption,created_at');

        if (error) {
          throw error;
        }

        if (postsData && postsData.length > 0) {
          // Fetch profile images for each creator
          const postsWithProfileImages: Post[] = await Promise.all(
            postsData.map(async (post) => {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('profileImg')
                .eq('username', post.creator)
                .single();
              const follow = await getFollowing(username);
              setFollowing(follow?.map((follow) => follow.followed));
              if (userError) {
                throw userError;
              }

              const profileImage = userData?.profileImg || '';

              return { ...post, profileImage };
            })
          );

          setPosts(
            postsWithProfileImages.filter((postProfile) =>
              followingRef.current?.includes(postProfile.creator)
            )
          );
          const likes: Record<string, number> = {};
          for (const post of postsData) {
            const { data: likesData, error: likeError } = await supabase
              .from('likes')
              .select('post_id')
              .eq('post_id', post.post_id);
            if (likeError) {
              throw likeError;
            }
            likes[post.post_id] = likesData.length;
          }
          setLikesCount(likes);
          // Fetch liked posts for the current user
          const { data: likedPostsData, error: likedPostsError } =
            await supabase
              .from('likes')
              .select('post_id')
              .eq('username', username);
          if (likedPostsError) {
            throw likedPostsError;
          }
          if (likedPostsData) {
            const likedPostIds = likedPostsData.map((item) => item.post_id);
            setLikedPosts(likedPostIds);
          }
          const { data: savedPostsData, error: savedPostsError } =
            await supabase
              .from('saved')
              .select('post_id')
              .eq('username', username);
          if (savedPostsError) throw savedPostsError;
          if (savedPostsData) {
            const savedPostIds = savedPostsData.map((item) => item.post_id);
            setSavedPosts(savedPostIds);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [setLikedPosts, setLikesCount, setSavedPosts, username, followingRef]);

  const handleLike = async (id: string) => {
    setLoading(true);
    try {
      if (likedPosts.includes(id)) {
        await deleteLike(id, username);
        setLikedPosts(likedPosts.filter((postId) => postId !== id));
        setLikesCount({ ...likesCount, [id]: likesCount[id] - 1 });
      } else {
        await addLike(id, username);
        setLikedPosts([...likedPosts, id]);
        setLikesCount({ ...likesCount, [id]: likesCount[id] + 1 });
      }
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string) => {
    if (savedPosts.includes(id)) {
      await deleteSave(id, username);
      setSavedPosts(savedPosts.filter((postId) => postId !== id));
    } else {
      await addSave(id, username);
      setSavedPosts([...savedPosts, id]);
    }
  };

  function getTimeAgo(timestamp: Date): string {
    const currentDate: Date = new Date();
    const createdAtDate: Date = new Date(timestamp);

    const timeDifferenceInSeconds: number = Math.floor(
      (currentDate.getTime() - createdAtDate.getTime()) / 1000
    );

    const timeDifference: TimeDifference = {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: timeDifferenceInSeconds,
    };

    timeDifference.years = Math.floor(timeDifference.seconds / 31536000);
    timeDifference.seconds %= 31536000;

    timeDifference.months = Math.floor(timeDifference.seconds / 2592000);
    timeDifference.seconds %= 2592000;

    timeDifference.days = Math.floor(timeDifference.seconds / 86400);
    timeDifference.seconds %= 86400;

    timeDifference.hours = Math.floor(timeDifference.seconds / 3600);
    timeDifference.seconds %= 3600;

    timeDifference.minutes = Math.floor(timeDifference.seconds / 60);
    timeDifference.seconds %= 60;

    if (timeDifference.years > 0) {
      return `${timeDifference.years}y`;
    } else if (timeDifference.months > 0) {
      return `${timeDifference.months}mo`;
    } else if (timeDifference.days > 0) {
      return `${timeDifference.days}d`;
    } else if (timeDifference.hours > 0) {
      return `${timeDifference.hours}h`;
    } else if (timeDifference.minutes > 0) {
      return `${timeDifference.minutes}m`;
    } else {
      return 'Now';
    }
  }

  if (loading) return <Loader />;

  return (
    <div>
      {posts &&
        posts.map((image: Post) => {
          return (
            <div className='h-full mb-4' key={image.post_id}>
              <div className='mx-auto w-full md:w-[50%] lg:w-[66%]'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center w-fit px-1'>
                    <button
                      className='w-8 mr-2 rounded-full cursor-pointer'
                      onClick={() => {
                        navigate(`/${image.creator}`);
                      }}
                    >
                      <Avatar>
                        <div className='rounded-full overflow-hidden h-8 w-8 flex items-center justify-center'>
                          <img
                            className='object-cover w-full h-full'
                            src={image.profileImage}
                            alt='Profile'
                          />
                        </div>
                      </Avatar>
                    </button>
                    <span
                      onClick={() => {
                        navigate(`/${image.creator}`);
                      }}
                      className='font-medium mr-1 cursor-pointer'
                    >
                      {image.creator}
                    </span>
                    <span className='text-slate-400 font-normal text-sm'>
                      • {getTimeAgo(image.created_at)}
                    </span>
                  </div>
                  <button
                    className='rounded-full w-6 h-6 pt-1'
                    onClick={() => setOpen(true)}
                  >
                    <img src='/insta-pics/more.png' />
                  </button>
                </div>
                {!(
                  image.imageUrl.slice(-3) === 'mp4' ||
                  image.imageUrl.slice(-3) === 'mp3'
                ) ? (
                  <img
                    className='w-full rounded mb-1 h-[590px] object-cover '
                    src={`${image.imageUrl}`}
                  />
                ) : (
                  <video
                    className='w-full object-cover rounded mb-1 h-[590px]'
                    controls
                  >
                    <source
                      src={image.imageUrl}
                      type={`video/${image.imageUrl.slice(-3)}`}
                    />
                  </video>
                )}
                <div className='flex justify-between items-center w-full mb-2'>
                  <div className='flex w-fit md:w-full gap-3'>
                    <img
                      onClick={() => {
                        handleLike(image.post_id);
                      }}
                      src={
                        likedPosts.includes(image.post_id)
                          ? '/insta-pics/heart.png'
                          : '/insta-pics/notifications.png'
                      }
                      alt='like'
                      className={`w-8 cursor-pointer ${
                        !likedPosts.includes(image.post_id) &&
                        'hover:opacity-50'
                      }`}
                    />
                    <img
                      onClick={() => onOpenComments(image)}
                      src='/insta-pics/comment.png'
                      alt='comment'
                      className='w-8 cursor-pointer hover:opacity-50'
                    />
                    <img
                      src='/insta-pics/share.png'
                      alt='share'
                      className='w-8 cursor-pointer hover:opacity-50'
                    />
                  </div>
                  <img
                    onClick={() => {
                      handleSave(image.post_id);
                    }}
                    src={
                      savedPosts.includes(image.post_id)
                        ? '/insta-pics/saved.png'
                        : '/insta-pics/save.png'
                    }
                    alt='save'
                    width={28}
                    className={`cursor-pointer ${
                      !savedPosts.includes(image.post_id)
                        ? 'hover:opacity-50 w-8'
                        : 'pr-1'
                    }`}
                  />
                </div>
                <div className='flex flex-col gap-1 mb-5 ml-1'>
                  <span className='cursor-pointer font-medium'>
                    {likesCount[image.post_id] ?? 0} likes
                  </span>
                  <div className='flex gap-1'>
                    <span
                      className='cursor-pointer font-medium'
                      onClick={() => {
                        navigate(`/${image.creator}`);
                      }}
                    >
                      {image.creator}
                    </span>
                    <span className='max-w-full text-wrap'>
                      {image.caption}
                    </span>
                  </div>
                  <span
                    className='text-zinc-400 font-normal text-sm cursor-pointer'
                    onClick={() => onOpenComments(image)}
                  >
                    View all comments
                  </span>
                  <span className='text-zinc-400 font-normal text-sm'>
                    Add a comment...
                  </span>
                </div>
                <span className='w-full'>
                  <hr />
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default PostDetails;
