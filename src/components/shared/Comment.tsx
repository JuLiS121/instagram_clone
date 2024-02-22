import { useNavigate } from 'react-router-dom';
import { ImageObject, TimeDifference } from './PostDetails';
import { Avatar } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';
import {
  addLike,
  addSave,
  deleteLike,
  deleteSave,
  getUserProfilePc,
} from '@/config/api';
import { supabase } from '@/config/supabase';
import { v4 as uuidv4 } from 'uuid';
import SingleComment from './SingleComment';
import Loader from './Loader';

export interface CommentType {
  commenter: string;
  comment: string;
  comment_id: string;
  created_at: Date;
}

const Comment = ({
  onCloseComments,
  selectedPost,
  likedPosts,
  savedPosts,
  likesCount,
  setOpen,
  setLikesCount,
  setLikedPosts,
  setSavedPosts,
  username,
  comments,
  setComments,
}: {
  comments: CommentType[];
  setComments: (arg0: (prevComments: CommentType[]) => CommentType[]) => void;
  username: string;
  setOpen: (arg0: boolean) => void;
  likesCount: { [postId: string]: number };
  setLikesCount: (arg0: { [postId: string]: number }) => void;
  likedPosts: string[];
  setLikedPosts: (arg0: string[]) => void;
  savedPosts: string[];
  setSavedPosts: (arg0: string[]) => void;
  onCloseComments: () => void;
  selectedPost: ImageObject | null;
}) => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      if (selectedPost) {
        setLoading(true);
        try {
          const data = await getUserProfilePc(selectedPost.creator);
          if (data) setProfilePic(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    getProfile();
  }, [selectedPost, setProfilePic]);

  const handleLike = async (id: string) => {
    if (likedPosts) {
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
    }
  };

  const handleSave = async (id: string) => {
    if (savedPosts) {
      if (savedPosts.includes(id)) {
        await deleteSave(id, username);
        setSavedPosts(savedPosts.filter((postId) => postId !== id));
      } else {
        await addSave(id, username);
        setSavedPosts([...savedPosts, id]);
      }
    }
  };

  const handleComment = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('comments').insert({
        comment_id: uuidv4(),
        comment: value,
        commenter: username,
        imageUrl: selectedPost?.imageUrl,
      });
      if (error) throw error;
      setComments((prevComments: CommentType[]) => [
        ...prevComments,
        {
          commenter: username,
          comment: value,
          comment_id: uuidv4(),
          created_at: new Date(),
        },
      ]);
      setValue('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const getComments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('commenter,comment,comment_id,created_at')
          .eq('imageUrl', selectedPost?.imageUrl);
        if (error) throw error;
        setComments((prevComments: CommentType[]) => [
          ...prevComments,
          ...data.map((comment) => ({
            commenter: comment.commenter,
            comment: comment.comment,
            comment_id: comment.comment_id,
            created_at: comment.created_at,
          })),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getComments();
  }, [selectedPost, setComments]);

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
      return `${timeDifference.years} years ago`;
    } else if (timeDifference.months > 0) {
      return `${timeDifference.months} months ago`;
    } else if (timeDifference.days > 0) {
      return `${timeDifference.days} days ago`;
    } else if (timeDifference.hours > 0) {
      return `${timeDifference.hours} hours ago`;
    } else if (timeDifference.minutes > 0) {
      return `${timeDifference.minutes} minutes ago`;
    } else {
      return 'Now';
    }
  }

  if (loading) return <Loader />;

  return (
    <div
      className='bg-[rgba(0,0,0,0.65)] fixed top-0 bottom-0 left-0 right-0 z-90'
      onClick={onCloseComments}
    >
      <span
        onClick={() => {
          onCloseComments();
        }}
        className='text-white cursor-pointer text-3xl fixed md:top-16 lg:top-2 md:right-10 top-10 right-4'
      >
        x
      </span>
      <div
        onClick={(e) => e.stopPropagation()}
        className='fixed top-[20%] h-3/5 lg:h-[94%] lg:top-[3%] left-[13%] w-[73%] bg-white rounded-sm flex flex-col lg:flex-row'
      >
        {!(
          (selectedPost && selectedPost.imageUrl.slice(-3) === 'mp4') ||
          (selectedPost && selectedPost.imageUrl.slice(-3) === 'mp3')
        ) ? (
          <img
            className='h-1/2 lg:h-full lg:w-1/2 w-full bg-no-repeat bg-white flex-start'
            src={selectedPost?.imageUrl}
            alt='image'
          />
        ) : (
          <video
            className='h-1/2 lg:h-full lg:w-1/2 w-full bg-no-repeat object-cover bg-white flex-start'
            controls
          >
            <source
              src={selectedPost?.imageUrl}
              type={`video/${selectedPost?.imageUrl.slice(-3)}`}
            />
          </video>
        )}
        <div className='flex h-1/2 lg:h-full lg:w-1/2 w-full mt-3 lg-mt-0 flex-col'>
          <div className='flex-start h-[12%] flex items-center justify-between border-b border-slate-200 w-full max-[768px]:pb-2'>
            <div className='flex items-center w-fit'>
              <button
                className='w-8 ml-3 mr-4 rounded-full cursor-pointer'
                onClick={() => {
                  onCloseComments();
                  navigate(`/${selectedPost?.creator}`);
                }}
              >
                <Avatar>
                  <div className='rounded-full overflow-hidden h-8 w-8 flex items-center justify-center'>
                    <img
                      className='object-cover w-full h-full'
                      src={profilePic}
                      alt='Profile'
                    />
                  </div>
                </Avatar>
              </button>
              <span
                className='font-medium mr-2 hover:opacity-60 cursor-pointer'
                onClick={() => {
                  onCloseComments();
                  navigate(`/${selectedPost?.creator}`);
                }}
              >
                {selectedPost?.creator}
              </span>
              <span>•</span>
            </div>
            <button
              className='rounded-full w-6 h-6 pb-1 mr-5'
              onClick={() => {
                setOpen(true);
              }}
            >
              <img src='/insta-pics/more.png' />
            </button>
          </div>
          <div
            className='h-[61%] w-full border-b border-gray-200 overflow-y-scroll'
            style={{ scrollbarWidth: 'none' }}
          >
            <div className='flex items-center w-fit mt-3 mb-6'>
              <button
                className='w-8 ml-3 mr-4 rounded-full cursor-pointer'
                onClick={() => {
                  onCloseComments();
                  navigate(`/${selectedPost?.creator}`);
                }}
              >
                <Avatar>
                  <div className='rounded-full overflow-hidden h-8 w-8 flex items-center justify-center'>
                    <img
                      className='object-cover w-full h-full'
                      src={profilePic}
                      alt='Profile'
                    />
                  </div>
                </Avatar>
              </button>
              <span
                className='font-medium mr-2 hover:opacity-60 cursor-pointer'
                onClick={() => {
                  onCloseComments();
                  navigate(`/${selectedPost?.creator}`);
                }}
              >
                {selectedPost?.creator}
              </span>
              <span>{selectedPost?.caption}</span>
            </div>
            {comments.map((comment) => (
              <SingleComment
                onCloseComments={onCloseComments}
                comment={comment}
                key={comment.comment_id}
              />
            ))}
          </div>
          <div className='h-[17%] border-b border-gray-200 z-10'>
            <div className='flex justify-between items-center w-full mb-3 mt-3'>
              <div className='flex w-full gap-3 ml-3'>
                <img
                  onClick={() => handleLike(selectedPost?.post_id || '')}
                  src={
                    likedPosts?.includes(selectedPost?.post_id || '')
                      ? '/insta-pics/heart.png'
                      : '/insta-pics/notifications.png'
                  }
                  alt='like'
                  className={`w-7 cursor-pointer ${
                    !likedPosts?.includes(selectedPost?.post_id || '') &&
                    'hover:opacity-50'
                  }`}
                />
                <img
                  src='/insta-pics/comment.png'
                  alt='comment'
                  className='w-7 cursor-pointer hover:opacity-50'
                />
                <img
                  src='/insta-pics/share.png'
                  alt='share'
                  className='w-7 cursor-pointer hover:opacity-50'
                />
              </div>
              <img
                onClick={() => handleSave(selectedPost?.post_id || '')}
                src={
                  savedPosts?.includes(selectedPost?.post_id || '')
                    ? '/insta-pics/saved.png'
                    : '/insta-pics/save.png'
                }
                alt='save'
                width={26}
                className={`cursor-pointer mr-3 ${
                  !savedPosts?.includes(selectedPost?.post_id || '')
                    ? 'hover:opacity-50 w-7'
                    : 'pr-1'
                }`}
              />
            </div>
            <div className='flex flex-col ml-4'>
              <span className='text-sm font-semibold'>
                {likesCount[selectedPost?.post_id ?? 0]} likes
              </span>
              <span className='text-zinc-400 font-normal text-xs'>
                {selectedPost && getTimeAgo(selectedPost.created_at)}
              </span>
            </div>
          </div>
          <div className='flex-end max-[768px]:mt-10 h-20 lg:h-fit flex bg-white'>
            <form
              className='lg:pt-3 h-full w-full flex justify-center items-center'
              onSubmit={(e) => {
                e.preventDefault();
                handleComment();
              }}
            >
              <input
                type='text'
                placeholder='Add a comment...'
                className='h-full w-[80%] focus:ring-0 outline-none text-sm'
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <button
                disabled={value ? false : true}
                type='submit'
                className={`text-cyan-500 text-sm font-semibold cursor-pointer ml-4 ${
                  !value && 'opacity-15'
                }`}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
